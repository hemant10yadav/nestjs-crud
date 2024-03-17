import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cluster from 'cluster';
import * as os from 'os';
import * as httpProxy from 'http-proxy';
const numCPUs = os.cpus().length;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.MULTI_MODE === 'true' && (cluster as any).isPrimary) {
    // Start the load balancer
    const proxy = httpProxy.createProxyServer({});

    const server = require('http').createServer((req, res) => {
      const workerId = getNextWorkerId();
      console.log(workerId);

      const port = parseInt(process.env.PORT || '8080') + workerId;

      // Round-robin load balancing
      proxy.web(req, res, {
        target: `http://localhost:${port || 8080}`,
      });
    });

    // Start worker processes
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs - 1; i++) {
      (cluster as any).fork();
    }

    (cluster as any).on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      (cluster as any).fork();
    });

    // Listen for requests on the load balancer
    server.listen(process.env.PORT || 8000, () => {
      console.log(
        `Load balancer is listening on port ${process.env.PORT || 8000}`,
      );
    });
  } else {
    let port = parseInt(process.env.PORT || '8080');
    if ((cluster as any)?.worker?.id) {
      port += (cluster as any).worker.id;
    }
    await app.listen(port);
    console.log(`Worker ${process.pid} started on port ${port}`);
  }
}
bootstrap();

function getNextWorkerId(): number {
  let id = 0;
  if ((cluster as any).workers) {
    const worker = Object.keys((cluster as any).workers);
    console.log(worker);

    const workerIds = worker.map((id) => parseInt(id));
    id = Math.min(...workerIds);
  }
  return id;
}

const { spawn } = require('child_process');

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['gatsby', 'build'], {
  env: process.env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let completed = false;

function write(stream, chunk) {
  stream.write(chunk);
  if (chunk.toString().includes('Done building in')) {
    completed = true;
    child.kill();
    process.exit(0);
  }
}

child.stdout.on('data', chunk => write(process.stdout, chunk));
child.stderr.on('data', chunk => write(process.stderr, chunk));

child.on('exit', code => {
  if (completed) {
    process.exit(0);
  }
  process.exit(code || 0);
});

child.on('error', error => {
  console.error(error);
  process.exit(1);
});

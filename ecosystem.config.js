require('dotenv').config();

module.exports = {
    apps : [{
        name: 'ЧАТ-СЕРВЕР',
        script: __dirname + '/server.js',
        cwd: __dirname,
        env: {
            NODE_ENV: 'production',
        },
        env_production: {
            NODE_ENV: 'production',
        },
        max_memory_restart: '1G',
        pid_file: __dirname + '/server.pid',
        listen_timeout: 5000,
        kill_timeout: 2000,
        watch: false,
        autorestart: true,
        min_uptime: 1000,
        max_restarts: 4,
        exec_mode: 'cluster',
        instances: -1,
        log_type: 'json',
        output: __dirname + '/logs/pm2.out.log',
        error: __dirname + '/logs/pm2.err.log',
        merge_logs: true
    }],
    deploy: {
        production: {
            env: {
                NODE_ENV: 'production',
            },
            user: process.env.SSH_USER,
            host: [process.env.SSH_HOST],
            ssh_options: ['StrictHostKeyChecking=no'],
            repo: 'https://github.com/koalex/node.js-lesson-12.git',
            ref: 'origin/master',
            path: process.env.PM2_PATH,
            // 'post-setup': '',
            'post-deploy': 'export NVM_DIR=/root/.nvm && [ -s $NVM_DIR/nvm.sh ] && . $NVM_DIR/nvm.sh &&' +
                'cp /home/node/.env /home/node/app/current/.env && ' +
                'npm install && git submodule init && git submodule update --remote && ' +
                'npm run bootstrap && pm2 startOrReload ecosystem.config.js --env production'
        },
        wnode_test: {
            env: {
                NODE_ENV: 'production',
            },
            user: process.env.SSH_USER,
            host: [process.env.SSH_HOST],
            ssh_options: ['StrictHostKeyChecking=no'],
            repo: 'https://github.com/w-node/node.js-lesson-12.git',
            ref: 'w-node/test_artillery',
            path: process.env.PM2_PATH,
            // 'post-setup': '',
            'post-deploy': 'export NVM_DIR=/root/.nvm && [ -s $NVM_DIR/nvm.sh ] && . $NVM_DIR/nvm.sh &&' +
                'cp /home/node/.env /home/node/app/current/.env && ' +
                'npm install && git submodule init && git submodule update --remote && ' +
                'npm run bootstrap && pm2 startOrReload ecosystem.config.js --env production'
        }
    }
};

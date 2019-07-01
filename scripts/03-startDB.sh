mongod --replSet "chat_rs" --logpath "logs/mongodb_rs0.log" --logappend --dbpath "$DB_PATH"/rs0 --port 27017 --config $DB_CONFIG_PATH &&
mongod --replSet "chat_rs" --logpath "logs/mongodb_rs1.log" --logappend --dbpath "$DB_PATH"/rs1 --port 29017 --config $DB_CONFIG_PATH &&
mongod --replSet "chat_rs" --logpath "logs/mongodb_rsh.log" --logappend --dbpath "$DB_PATH"/rsh --port 31017 --config $DB_CONFIG_PATH

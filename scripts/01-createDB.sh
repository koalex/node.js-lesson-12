
configRS="{
	_id: 'chat_rs',
	members: [
		{
			_id: 0,
			host: '127.0.0.1:27017',
			priority: 2,
			votes: 1,
			hidden: false
		},
		{
			_id: 1,
			host: '127.0.0.1:29017',
			priority: 1,
			votes: 1,
			hidden: false
		},
		{
			_id: 2,
			host: '127.0.0.1:31017',
			priority: 0,
			votes: 0,
			hidden: true
		}
	]
}"


mongod --replSet "chat_rs" --fork --logpath "../logs/mongodb_rs0.log" --logappend --dbpath "../db/rs0" --port 27017 &&
mongod --replSet "chat_rs" --fork --logpath "../logs/mongodb_rs1.log" --logappend --dbpath "../db/rs1" --port 29017 &&
mongod --replSet "chat_rs" --fork --logpath "../logs/mongodb_rsh.log" --logappend --dbpath "../db/rsh" --port 31017 &&

mongo --host localhost:27017,localhost:29017,localhost:31017 --eval "rs.initiate($configRS)" &&
mongo --host localhost:27017,localhost:29017,localhost:31017 --eval "db.getMongo().setReadPref('primaryPreferred')"


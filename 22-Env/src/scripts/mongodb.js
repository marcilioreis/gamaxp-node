// docker ps
// winpty docker exec -it 275bc72696a3     mongo -u marcilioreis -p 62724546 --authenticationDatabase heroes

// databases
// show dbs

// mudando o contexto par auma database
// use heroes

// mostras as tables (collections)
// show collections

// create
db.heroes.insert({
  nome: `Clone-${i}`,
  poder: "Velocidade",
  dataNascimento: "1985-07-19",
});

// read
db.heroes.find();
db.heroes.find().pretty();
db.heroes.find().limit(150).sort({ nome: -1 });
db.heroes.find({ nome: "Flash" });
db.heroes.find({}, { poder: 1, _id: 0 });
db.heroes.findOne();
db.heroes.findOne({ _id: ObjectId("5ee5305a3bc852bd289c915b") });

db.heroes.count();

// update
db.heroes.update(
  { _id: ObjectId("5ee5305a3bc852bd289c90e4") },
  { nome: "Mulher Maravilha" }
);

db.heroes.update(
  { _id: ObjectId("5ee5305a3bc852bd289c915b") },
  { $set: { nome: "Lanterna Verde" } }
);

db.heroes.update({ poder: "Velocidade" }, { $set: { poder: "Space ACAB" } });

// delete
db.heroes.remove({});
db.heroes.remove({ nome: "Lanterna Verde" });

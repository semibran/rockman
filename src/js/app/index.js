const bulk = require('bulk-require')
const Stage = require('./stage')
const Actor = require('./actor')
const stages = bulk(__dirname + '/stages', '*/index.js')
const actors = bulk(__dirname + '/actors', '*/index.js')

for (let name in stages)
	delete stages[name].index

for (let name in actors)
	delete actors[name].index

module.exports = { Stage, Actor, stages, actors }

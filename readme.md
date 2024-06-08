### Notes

All stops for given trip

```cypher
MATCH (t:Trip {tripId: 1})<-[:PART_OF_TRIP]-(st:Stoptime)-[:LOCATED_AT]->(s:Stop)
RETURN s
ORDER BY st.stopSequence
```

All trips going through given stop

```cypher
MATCH (s:Stop {stopId: 244})<-[:LOCATED_AT]-(st:Stoptime)-[:PART_OF_TRIP]->(t:Trip)
RETURN DISTINCT t
ORDER BY t.tripId
```

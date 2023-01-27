const {MongoClient} = require('mongodb');
async function main (){
    // const uri = "mongodb+srv://sanket:password_123@cluster0.nyzq6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const uri = "mongodb+srv://Ruchita:Ruchita421@cluster0.sy0ss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
        await client.connect();

        await ObesityBasedOnState(client);

    } catch(e){
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);
async function ObesityBasedOnState(client){
    const pipeline = [
        {
            '$project': {
                'State': 1, 
                'obesity_percentage': 1, 
                '_id': 0
            }
        }, {
            '$group': {
                '_id': '$State', 
                'avgObesity': {
                    '$avg': '$obesity_percentage'
                }
            }
        }, {
            '$sort': {
                'avgObesity': 1
            }
        }, {
            '$limit': 5
        }
    ];
      const aggCursor = client.db("Obesity").collection("Obesity").aggregate(pipeline);
      console.log(`Top 5 states which are doing great in curbing obesity - `);
      await aggCursor.forEach(obesityPercentage => {
          console.log(`${obesityPercentage._id} : ${obesityPercentage.avgObesity.toFixed(2)}`);
      })
      const pipeline1 = [
        {
            '$project': {
                'State': 1, 
                'obesity_percentage': 1, 
                '_id': 0
            }
        }, {
            '$group': {
                '_id': '$State', 
                'avgObesity': {
                    '$avg': '$obesity_percentage'
                }
            }
        }, {
            '$sort': {
                'avgObesity': -1
            }
        }, {
            '$limit': 5
        }
    ];
      const aggCursor1 = client.db("Obesity").collection("Obesity").aggregate(pipeline1);
      console.log(`States which are NOT doing great in curbing obesity - `);
      await aggCursor1.forEach(obesityPercentage => {
        console.log(`${obesityPercentage._id} : ${obesityPercentage.avgObesity.toFixed(2)}`);
      })
}
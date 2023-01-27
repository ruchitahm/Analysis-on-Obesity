const {MongoClient} = require('mongodb');
async function main (){
    const uri = "mongodb+srv://Ruchita:Ruchita421@cluster0.sy0ss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
    await client.connect();
    await AvgObesityPercentageBasedOnEducation(client);
    } catch(e){
        console.error(e);
    } finally{
        await client.close();
    }
}
main().catch(console.error);
async function AvgObesityPercentageBasedOnEducation(client){
    console.log(` Education Level : Percentage of Obesity -`);
    const pipeline = 
    [
        {
          '$project': {
            'Education': 1, 
            'obesity_percentage': 1
          }
        }, {
          '$group': {
            '_id': '$Education', 
            'avgObesityPercentageEducation': {
              '$avg': '$obesity_percentage'
            }
          }
        }, {
          '$match': {
            '_id': {
              '$gt': ''
            }
          }
        }, {
          '$sort': {
            '_id': 1
          }
        }
      ]
    const aggCursor = client.db("Obesity").collection("Obesity").aggregate(pipeline);
    await aggCursor.forEach(objesityListing => {
        console.log(`${objesityListing._id}: ${objesityListing.avgObesityPercentageEducation.toFixed(2)}`);
    });
}
const {MongoClient} = require('mongodb');
async function main (){
    const uri = "mongodb+srv://Ruchita:Ruchita421@cluster0.sy0ss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
    await client.connect(); 
    await AvgLower_confidence_percentage(client);
    } catch(e){
        console.error(e);
    } finally{
        await client.close();
    }
}
main().catch(console.error);
async function AvgLower_confidence_percentage(client){
    console.log(` State : Percentage of people with Obesity : Percentage of people with low self-confidence `);
    const pipeline = 
    [
        {
          '$project': {
            'Year': 1, 
            'State': 1, 
            'obesity_percentage': 1, 
            'Lower_confidence_percentage': 1
          }
        }, {
          '$group': {
            '_id': '$State', 
            'avgLowerConfidencePercentage': {
              '$avg': '$Lower_confidence_percentage'
            }, 
            'avgObesityPercentage': {
              '$avg': '$obesity_percentage'
            }
          }
        }, {
          '$sort': {
            'avgLowerConfidencePercentage': 1
          }
        }
      ]
    const aggCursor = client.db("Obesity").collection("Obesity").aggregate(pipeline);
    await aggCursor.forEach(objesityListing => {
        console.log(`${objesityListing._id}: ${objesityListing.avgObesityPercentage.toFixed(2)}: ${objesityListing.avgLowerConfidencePercentage.toFixed(2)}`);
    });
}
const {MongoClient} = require('mongodb');
async function main (){
    // const uri = "mongodb+srv://sanket:password_123@cluster0.nyzq6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const uri = "mongodb+srv://Ruchita:Ruchita421@cluster0.sy0ss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try{
        await client.connect();
        await ObesityPhysicalEffects(client);
    } catch(e){
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);
async function ObesityPhysicalEffects(client){
    const pipeline = [
        {
            '$group': {
                '_id': '$State', 
                'avgDiabetes': {
                    '$avg': '$Diabetes_Percent'
                }, 
                'avgObesity': {
                    '$avg': '$Obesity_Percent'
                }, 
                'avgInactivity': {
                    '$avg': '$Inactivity_Percent'
                }
            }
        }, {
            '$match': {
                'avgObesity': {
                    '$gte': 0
                }
            }
        }, {
            '$sort': {
                'avgObesity': -1
            }
        }
    ]; 
      const aggCursor = client.db("Obesity").collection("Obesity3").aggregate(pipeline);
        console.log(`State : Percentage of people with Obesity : Percentage of people with Diabetes : Percentage of inactive residents`);
        await aggCursor.forEach(obesityPercentage => {
          console.log(`${obesityPercentage._id} : ${obesityPercentage.avgObesity.toFixed(2)} : ${obesityPercentage.avgDiabetes.toFixed(2)} : ${obesityPercentage.avgInactivity.toFixed(2)}`);
      })
}
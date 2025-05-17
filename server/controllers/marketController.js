const supabase = require('../supaBaseClient');

const createMarket = async (req,res) => {
    console.log('Request Body:', req.body); 
    const {question,deadline} = req.body;

    //checking if we get the values from the body correclty
    if(!question || !deadline)
    {
        return res.status(400).json({error:'Question and deadline requrired'})
    }


    //after checks inserting the values into the database
    const { data, error } = await supabase
    .from('markets')
    .insert([{ question, deadline }])
    .select();

    if(error) 
        return res.status(500).json({error:error.message});

    res.status(201).json(data);
}

    //getting all the markets 
const getMarkets = async (req,res) =>{
    const {data,error} =  await supabase
    .from('markets')
    .select('*')
    .order('created_at'
    ,{ascending:false});

    if(error) return res.status(500).json({error:error.message});
    res.json(data);
}

module.exports = {createMarket,getMarkets};

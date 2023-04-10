import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    try {
        const data = await fs.readFile(path.join(process.cwd(), 'jsons_daily','current_date.json'),'utf8');
        res.status(200).json(JSON.parse(data));
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error'});
        
    }
}
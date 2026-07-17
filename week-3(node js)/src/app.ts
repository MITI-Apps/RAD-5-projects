import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { User } from './types.js';
import http from 'http';            // built-in module, no install needed

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data.json');

async function getStudent(): Promise<User []>{
    try{
      const rawData: any = await fs.readFile(dataPath, 'utf-8');
      const allUsers: User[] = JSON.parse(rawData)
      return allUsers

    } catch (error){
        console.error("Error reading or parsing data.json:", error);
        return[];
    }
}
const foundUser = (studendID: string) => {
    return new Promise(async (resolve, reject) => {
        const allUsers = await getStudent()
        const student: User  | undefined = allUsers.find(user => user.id === studendID)
        if (!student){
            reject("this user doesn't exist");
            return;
        };

        if (student.role === "STUDENT"){
            const updatedStudent: User = {
                ...student,
                name: student.name.toUpperCase(),
                gpa: 4.0
            }
            const updatedAllUsers = allUsers.map(user => user.id === studendID ? updatedStudent : user)
            const newDataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'updatedData.json');
            fs.writeFile(newDataPath, JSON.stringify(updatedAllUsers, null, 2), 'utf-8')
            resolve(updatedAllUsers)
        } else {
            reject(`Access denied the user with id ${studendID} is a teacher not a student`)
        };
    });
};



// --- HTTP server starts here ---
// -- craeting the server ---
const server = http.createServer(async (req, res) => {
    foundUser("v02")
        .then(student => res.end(JSON.stringify(student)))        // ← shows in browser
        .catch(error => res.end(JSON.stringify(error)));    // ← shows in terminal like before
});
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
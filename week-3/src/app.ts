import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { User } from './types.js';

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
            resolve(student)
        } else {
            reject(`Access denied the user with id ${studendID} is a teacher not a student`)
        }
    })
}

foundUser("u01")
  .then(student => console.log("Found", student))
  .catch(error => console.error("rejected", error))
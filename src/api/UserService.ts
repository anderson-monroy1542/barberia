import User from "@/interface/User";
import axios from "axios";


export default class UserService {

    /**Inicia sesión en la API de la barbería */
    async login(correo: string, password: string): Promise<User> {
        try {
            
            const response = await axios.post(
                `http://localhost:3000/usuarios/login`, 
                {
                    correo: correo,
                    password: password 
                }
            );
            const user: User = response.data;
            return user;

        } catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    }

    //Registra un nuevo usuario en la API de la barbería.
    async add(user: User): Promise<any> {
        try {
            const response = await axios.post(
                `http://localhost:3000/usuarios/registrar`,
                user 
            );
            return response.data;

        } catch (error) {
            console.error("Error al registrar:", error);
            throw error;
        }
    }
}
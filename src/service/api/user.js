import axiosServices from "../axiosService";

async function getUsers() {
    const url = '/users';
    return await axiosServices.get(url);
}

export default {
    getUsers
}

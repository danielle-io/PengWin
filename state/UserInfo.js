// Later this file will get this information from the email +
// password unlocking the user's information
const user_id = 4;
const child_id = 6;
const parent_id = 2;
const pincode = "1234";

function getUserInfo(env) {
    return {"user_id": user_id, "child_id": child_id, "parent_id": parent_id, "pincode": pincode}
}
var UserInfo = getUserInfo();

export default UserInfo;
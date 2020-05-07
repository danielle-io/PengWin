const user_id = 1;
const child_id = 1;
const parent_id = 1;

function getUserInfo(env) {
    return {"user_id": user_id, "child_id": child_id, "parent_id": parent_id}
}
var UserInfo = getUserInfo();

export default UserInfo;
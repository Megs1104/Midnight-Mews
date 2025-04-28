const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};
exports.formattedTopicsData = (topicsData) => {
 return topicsData.map((topicData) => {
  return [
    topicData.slug,
    topicData.description,
    topicData.img_url
  ]
 })
}
exports.formattedUsersData = (usersData) => {
  return usersData.map((userData) => {
    return [
      userData.username,
      userData.name,
      userData.avatar_url
    ]
  })
}
exports.createReferenceObject = (articlesData) => {
  if (articlesData.length === 0){
    return {};
  }
  const result = {};
  articlesData.forEach((article) => {
    result[article.title] = article.article_id
  });
  return result;
}
module.exports = function(req, res, next){
if (!req.user.isAdmin)return res.status(403).send('Acess denied. vous avez pas les droits requis')
next();
}
var express = require('express');
var router  = express.Router();

router.get('/i18n', function(req, res) {
   // cuando esta por defecto, manda undefined, esto arregla eso
   if (typeof req.session.locale == 'undefined')
      res.send('es');
   else {
      // si no es undefined, que mande el locale
      res.send(req.session.locale);
   }
});

router.get('/i18n/:lang', function(req, res) {
   if (typeof req.params.lang !== 'undefined') {
      res.setLocale(req.params.lang);
      req.session.locale = req.params.lang;
   }
   res.send(true);
});

module.exports = router;
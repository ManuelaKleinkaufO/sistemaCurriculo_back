import { Router } from 'express';
import { getCurriculum, createCurriculum, getCurriculumById } from '../controller/curriculumController';
import csrf from 'csurf';

const router = Router();
const csrfProtection = csrf({ cookie: true });

// Rota GET para enviar o token CSRF
router.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});


router.get('/curriculos', getCurriculum);

// Rota POST com proteção CSRF
router.post('/curriculo', csrfProtection, createCurriculum);
  

router.get('/curriculo/:id', getCurriculumById);

export default router;

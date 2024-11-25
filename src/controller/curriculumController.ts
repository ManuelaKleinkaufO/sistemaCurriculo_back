import { Request, Response } from 'express';
import * as curriculumService from '../service/curriculumService';
import xss from 'xss';
import * as Yup from 'yup';

const noScriptRegex = /^(?!.*(<script.*?>|javascript:|onerror=|onload=|onclick=|onmouseover=|onfocus=|oninput=|<.*?script.*?>|<.*?object.*?>|<.*?embed.*?>)).*$/i;

const curriculumSchema = Yup.object().shape({
  name: Yup.string()
    .matches(noScriptRegex, 'Entradas com scripts não são permitidas')
    .required('Nome é obrigatório'),
  phone: Yup.string().optional().matches(noScriptRegex, 'Entradas com scripts não são permitidas'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  webAddress: Yup.string()
    .url('Endereço da Web inválido')
    .matches(noScriptRegex, 'Entradas com scripts não são permitidas')
    .optional(),
  experience: Yup.string()
    .matches(noScriptRegex, 'Entradas com scripts não são permitidas')
    .optional(),
});

export const getCurriculum = async (req: Request, res: Response) => {
  try {
    const curriculum = await curriculumService.getAllCurriculum();
    // Sanitizando cada campo do currículo antes de enviar
    const sanitizedCurriculum = curriculum.map((curr) => ({
      nome: xss(curr.nome),
      email: xss(curr.email),
      id:xss(curr.id)
    }));
    res.json(sanitizedCurriculum);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar" });
  }
};

export const getCurriculumById = async (req: Request, res: Response) => { 
  try {
    const { id } = req.params;
    const result = await curriculumService.getCurriculumById(id);
    // Sanitizando a resposta antes de retornar ao cliente
    if (result) {
      const sanitizedResult = {
        nome: xss(result.nome),
        email: xss(result.email),
        id: xss(result.id),
        telefone: xss(result.telefone ?? ''),
        enderecoWeb: xss(result.endereco_web ?? ''),
        experiencia: xss(result.experiencia),
      };
      res.json(sanitizedResult);
    } else {
      res.status(404).json({ error: "Currículo não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o currículo" });
  }
};

export const createCurriculum = async (req: Request, res: Response) => {
  try {
    await curriculumSchema.validate(req.body, { abortEarly: false });
    const sanitizedData = {
      name: xss(req.body.name),
      phone: req.body.phone ? xss(req.body.phone) : '',
      email: xss(req.body.email),
      webAddress: req.body.webAddress ? xss(req.body.webAddress) : '',
      experience: xss(req.body.experience),
    };

    await curriculumSchema.validate(sanitizedData, { abortEarly: false });

    const newCurriculum = await curriculumService.createCurriculum(sanitizedData);
    res.status(201).json(newCurriculum);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar" });
  }
};

import prisma from '../prisma/client';
import * as Yup from 'yup';
import  createDOMPurify  from 'dompurify';
import { JSDOM }  from 'jsdom';
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

interface createCurriculum{
    name: string,
    phone?: string,
    email: string,
    webAddress?: string,
    experience: string
}

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

const validateId = Yup.string()
  .required('ID é obrigatório')
  .matches(
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    'ID deve ser um UUID válido'
  );

export const getAllCurriculum = async () => {
  return await prisma.curriculo.findMany(
    {
        select: {
            id: true,
            nome: true,
            email: true
        }
    }
  );
};

export const getCurriculumById = async (id: string) => {
  try {
    await validateId.validate(id, { abortEarly: false })
    return await prisma.curriculo.findUnique({
      where:{
        id:id
      }
    })
  } catch (error) {
    console.error('Error get curriculum:', error);
    throw new Error('Failed to get curriculum');
  }
  
}

export const createCurriculum = async (data: createCurriculum) => {
  try {
    // Validação dos dados antes de proceder
    await curriculumSchema.validate(data, { abortEarly: false });
    
    // Sanitização adicional (caso necessário)
    const sanitizedNome = DOMPurify.sanitize(data.name);  // Sanitização para XSS
    const sanitizedEmail = DOMPurify.sanitize(data.email);  // Sanitização para XSS
    const sanitizedTelefone = DOMPurify.sanitize(data.phone || '');  // Sanitização para XSS
    const sanitizedEnderecoWeb = DOMPurify.sanitize(data.webAddress || '');  // Sanitização para XSS
    const sanitizedExperiencia = DOMPurify.sanitize(data.experience);  // Sanitização para XSS

    // Criação do currículo com o Prisma (usando dados validados e sanitizados)
    const curriculum = await prisma.curriculo.create({
      data: {
        nome: sanitizedNome,
        telefone: sanitizedTelefone,
        email: sanitizedEmail,
        endereco_web: sanitizedEnderecoWeb,
        experiencia: sanitizedExperiencia,
      },
    });

    return curriculum;
    
  } catch (error: any) {
    console.error('Error creating curriculum:', error.message || error);
    throw new Error('Failed to create curriculum');
  }
};


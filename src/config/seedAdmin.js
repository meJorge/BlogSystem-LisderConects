const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const Category = require('../models/Category');
const Post     = require('../models/Post');
const Comment  = require('../models/Comment');

const slugify = (s) =>
  s.toLowerCase().trim()
   .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/\s+/g, '-').replace(/[^\w-]/g, '');

/* ═══════════════════════ CATEGORÍAS ═══════════════════════ */
const CATEGORIES = [
  { name: 'Tecnología',    color: '#1d9bf0' },
  { name: 'Programación',  color: '#7856ff' },
  { name: 'Diseño',        color: '#ff7a00' },
  { name: 'Tutoriales',    color: '#00ba7c' },
  { name: 'Opinión',       color: '#f4212e' },
  { name: 'Noticias',      color: '#fbbf24' },
  { name: 'Productividad', color: '#14b8a6' },
  { name: 'Carrera',       color: '#ec4899' },
];

/* ═══════════════════════ USUARIOS ═══════════════════════ */
const DEMO_USERS = [
  { name: 'Administrador', email: 'admin@blogx.com',      password: 'admin123', role: 'admin',  bio: 'Editor en jefe de BlogX. Apasionado por la tecnología y la escritura.' },
  { name: 'Sofia Ramirez', email: 'sofia@blogx.com',      password: 'autor123', role: 'author', bio: 'Desarrolladora frontend con 6 años de experiencia. Fan de React y el diseño accesible.' },
  { name: 'Carlos Mendoza',email: 'carlos@blogx.com',     password: 'autor123', role: 'author', bio: 'Ingeniero de software especializado en backend y arquitectura de sistemas.' },
  { name: 'Valentina Cruz',email: 'valentina@blogx.com',  password: 'autor123', role: 'author', bio: 'UX/UI Designer. Creo experiencias digitales que la gente realmente disfruta usar.' },
];

/* ═══════════════════════ POSTS ═══════════════════════ */
const makePosts = (users, cats) => {
  const u = (n) => users.find(x => x.name === n)?._id;
  const c = (n) => cats.find(x => x.name === n)?._id;
  const d = (n) => new Date(Date.now() - n * 86400000);
  return [
    {
      title: 'El futuro de la Inteligencia Artificial en 2025',
      slug:  'futuro-inteligencia-artificial-2025',
      excerpt: 'Los modelos de lenguaje ya no son un experimento de laboratorio. Analizamos como estan redefiniendo industrias enteras y que esperar en los proximos 12 meses.',
      content: '<h2>Un ano de transformacion</h2><p>Si 2023 fue el ano en que el mundo descubrio los LLMs, 2024 fue el ano en que empezo a usarlos de verdad. Y 2025 promete ser el ano en que se vuelven <strong>invisibles</strong> — integrados tan profundamente en los flujos de trabajo que dejan de ser una novedad para convertirse en infraestructura.</p><h2>Multimodalidad como estandar</h2><p>La capacidad de procesar texto, imagen, audio y video en un mismo modelo dejo de ser un diferenciador competitivo para convertirse en el minimo esperado. Los usuarios ya no preguntan si puede ver imagenes — asumen que si.</p><blockquote>La IA mas poderosa es la que no notas que estas usando.</blockquote><h2>Agentes autonomos</h2><p>El salto mas significativo de este ano es el de los <em>agentes</em>: sistemas de IA capaces de planificar, ejecutar acciones, verificar resultados y corregir errores sin intervencion humana en cada paso. Desde reservar vuelos hasta depurar codigo en produccion.</p><h2>Riesgos que no podemos ignorar</h2><p>Con mayor capacidad viene mayor responsabilidad. La desinformacion generada por IA, los sesgos amplificados a escala y las implicaciones laborales son conversaciones que no podemos postergar.</p><h2>Conclusion</h2><p>2025 no sera el ano en que la IA llegue — ya llego. Sera el ano en que decidamos colectivamente como convivir con ella.</p>',
      author: u('Administrador'), category: c('Tecnología'),
      tags: ['inteligencia artificial','llm','agentes','futuro'],
      status: 'published', publishedAt: d(12),
      coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
      views: 1847,
    },
    {
      title: 'React 19: todo lo que necesitas saber',
      slug:  'react-19-todo-lo-que-necesitas-saber',
      excerpt: 'Server Components estables, el nuevo compilador, useFormState y mas. Una guia completa de las novedades mas importantes de la version 19 de React.',
      content: '<h2>Una version que lo cambia todo</h2><p>React 19 no es una actualizacion menor. Es el resultado de anos de trabajo del equipo de Meta para resolver algunos de los problemas mas frustrantes del ecosistema: re-renders innecesarios, complejidad en el manejo de formularios y la brecha entre cliente y servidor.</p><h2>El nuevo compilador</h2><p>Olvídate de <code>useMemo</code>, <code>useCallback</code> y <code>memo</code> para la mayoria de los casos. El compilador de React 19 analiza tu codigo automaticamente y aplica las optimizaciones necesarias. En benchmarks internos, mejoras de rendimiento del <strong>40% en promedio</strong> sin tocar una linea de codigo.</p><h2>Server Components estables</h2><p>Despues de anos en fase experimental, los Server Components ya son API estable. Permiten renderizar componentes directamente en el servidor, eliminar dependencias del bundle del cliente y acceder a bases de datos sin APIs intermedias.</p><h2>useFormState y useFormStatus</h2><p>El manejo de formularios ha sido historicamente verboso en React. Los nuevos hooks simplifican drasticamente los casos mas comunes: validacion, estados de carga y errores del servidor.</p><h2>Cuando migrar?</h2><p>Si estas en un proyecto nuevo, empieza con React 19 desde el dia uno. Para proyectos existentes, la migracion es incremental.</p>',
      author: u('Sofia Ramirez'), category: c('Programación'),
      tags: ['react','javascript','frontend','web'],
      status: 'published', publishedAt: d(8),
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
      views: 2341,
    },
    {
      title: 'Guia completa de CSS Grid en 2025',
      slug:  'guia-completa-css-grid-2025',
      excerpt: 'CSS Grid ya no es una tecnologia emergente — es el estandar. Esta guia te lleva desde los conceptos basicos hasta los patrones mas avanzados con ejemplos reales.',
      content: '<h2>Por que Grid cambio el diseno web</h2><p>Antes de CSS Grid, crear layouts de dos dimensiones requeria hacks con floats, tablas o JavaScript. Grid llego para hacer lo que deberia haber sido posible desde el principio: <strong>disenar en dos dimensiones de forma declarativa</strong>.</p><h2>Conceptos fundamentales</h2><p>Un grid se define en el contenedor y afecta a sus hijos directos. Las propiedades mas importantes son <code>grid-template-columns</code>, <code>grid-template-rows</code>, <code>gap</code> y <code>grid-column / grid-row</code>.</p><h2>El truco que mas te va a gustar</h2><p>La unidad <code>fr</code> distribuye el espacio disponible de forma proporcional. Combinada con <code>repeat()</code> y <code>minmax()</code>, crea layouts responsivos sin una sola media query.</p><pre><code>.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:24px; }</code></pre><h2>Subgrid — el game changer</h2><p>Con soporte en todos los navegadores modernos, <code>subgrid</code> permite que los elementos hijos participen en el grid de su ancestro, resolviendo el problema del alineamiento de tarjetas con contenido variable.</p>',
      author: u('Valentina Cruz'), category: c('Tutoriales'),
      tags: ['css','grid','diseno','frontend'],
      status: 'published', publishedAt: d(5),
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80',
      views: 983,
    },
    {
      title: 'Node.js vs Bun vs Deno: cual elegir en 2025',
      slug:  'nodejs-vs-bun-vs-deno-2025',
      excerpt: 'El ecosistema de JavaScript en el servidor nunca fue tan competitivo. Comparamos los tres runtimes en rendimiento, ecosistema y experiencia de desarrollo.',
      content: '<h2>El monopolio se acabo</h2><p>Durante anos, Node.js fue sinonimo de JavaScript en el servidor. Hoy, Bun y Deno presentan alternativas serias con propuestas de valor concretas.</p><h2>Node.js: el rey que se adapta</h2><p>Con mas de 14 anos de historia y el ecosistema de npm mas grande del mundo, Node.js sigue siendo la eleccion segura. La version 22 incorpora soporte nativo para TypeScript sin compilacion.</p><p><strong>Cuando elegirlo:</strong> proyectos en produccion con equipos grandes, cuando el ecosistema de paquetes es critico.</p><h2>Bun: velocidad ante todo</h2><p>Bun promete y cumple en benchmarks: es 3-4x mas rapido que Node en operaciones de I/O, incluye bundler, transpilador y gestor de paquetes en un solo binario.</p><p><strong>Cuando elegirlo:</strong> microservicios donde el tiempo de arranque y el throughput son criticos.</p><h2>Deno: la apuesta por los estandares</h2><p>Deno fue el primero en apostar por las APIs web estandar en el servidor. Su sistema de permisos explicitos es un diferenciador en seguridad.</p><h2>Veredicto</h2><p>Si estas empezando algo nuevo, <strong>Bun</strong> ofrece la mejor experiencia de desarrollo. Para produccion con equipos grandes, <strong>Node.js</strong> sigue siendo la apuesta mas segura.</p>',
      author: u('Carlos Mendoza'), category: c('Programación'),
      tags: ['nodejs','bun','deno','javascript','backend'],
      status: 'published', publishedAt: d(3),
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
      views: 1562,
    },
    {
      title: 'Diseno de interfaces oscuras: principios y errores comunes',
      slug:  'diseno-interfaces-oscuras-principios-errores',
      excerpt: 'El modo oscuro no es solo invertir colores. Es una decision de diseno que afecta contraste, jerarquia y accesibilidad.',
      content: '<h2>El error mas comun</h2><p>La mayoria de los dark modes fallidos tienen el mismo problema: <strong>negro puro (#000000) como fondo</strong>. El contraste extremo entre texto blanco y fondo negro causa fatiga visual.</p><p>Los mejores dark modes usan negros calidos o azulados, como <code>#0d1117</code> (GitHub) o <code>#0a0c0e</code>. La clave es que el ojo lo perciba como oscuro sin ser literal.</p><h2>Elevacion con luminosidad</h2><p>En interfaces claras, la elevacion se comunica con sombras. En interfaces oscuras, las sombras son casi invisibles. La elevacion se comunica con luminosidad: las superficies mas cercanas al usuario son mas claras.</p><blockquote>En dark mode, la luz viene de abajo, no de arriba. — Material Design 3</blockquote><h2>Accesibilidad ante todo</h2><p>WCAG 2.1 exige una ratio de contraste minima de 4.5:1 para texto normal. Verifica contraste con Stark o Colour Contrast Analyser.</p><h2>Recomendaciones</h2><ul><li>Nunca uses negro puro como fondo base</li><li>Usa entre 4-6 niveles de superficie</li><li>Desatura los colores de acento un 15-20%</li><li>Prueba en pantallas OLED reales</li></ul>',
      author: u('Valentina Cruz'), category: c('Diseño'),
      tags: ['dark mode','ui','ux','accesibilidad'],
      status: 'published', publishedAt: d(15),
      coverImage: 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=1200&q=80',
      views: 724,
    },
    {
      title: 'Como pasar de junior a senior sin quemarte en el intento',
      slug:  'junior-a-senior-sin-quemarte',
      excerpt: 'El salto no es solo tecnico. Es una transformacion en como piensas, comunicas y priorizas. Esto es lo que nadie te dice sobre el camino a senior.',
      content: '<h2>El mito de la barrera tecnica</h2><p>Muchos developers juniors creen que la diferencia entre junior y senior esta en cuantos algoritmos conocen. Estan equivocados. La diferencia real esta en como <strong>abordan los problemas</strong> y como <strong>multiplican a los demas</strong>.</p><h2>Lo que si importa</h2><ul><li>Hace las preguntas correctas antes de escribir codigo</li><li>Sabe cuando NO escribir codigo</li><li>Comunica tradeoffs, no solo soluciones</li><li>Hace que los juniors sean mejores con su presencia</li></ul><h2>El burnout del perfeccionismo</h2><p>Intentar ser experto en todo simultaneamente es uno de los patrones mas destructivos. Los mejores seniors tienen profundidad en 2-3 areas y anchura suficiente para colaborar en el resto.</p><h2>La habilidad mas subestimada</h2><p>Escribir bien. Documentacion, PRs, comentarios, Slack — la claridad escrita multiplica tu impacto cuando no estas en la sala.</p>',
      author: u('Carlos Mendoza'), category: c('Carrera'),
      tags: ['carrera','senior','desarrollo profesional'],
      status: 'published', publishedAt: d(20),
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
      views: 3102,
    },
    {
      title: 'TypeScript 5.5: las features que cambian tu dia a dia',
      slug:  'typescript-55-features-dia-a-dia',
      excerpt: 'Inferencia de tipos mejorada, nuevos type predicates, soporte para Set operations y mas. Un repaso honesto de que vale la pena adoptar hoy.',
      content: '<h2>Inferencia de type predicates</h2><p>TypeScript 5.5 finalmente puede inferir type predicates en funciones filtro, eliminando uno de los patrones mas verbosos del ecosistema.</p><pre><code>// Antes\nconst nonNull = (x) => x !== null; // no inferia el predicate\n// Ahora — TypeScript lo infiere automaticamente</code></pre><h2>Set operations</h2><p>JavaScript ahora tiene metodos nativos para operaciones de conjuntos, y TypeScript 5.5 los tipifica correctamente: <code>union()</code>, <code>intersection()</code>, <code>difference()</code>.</p><h2>Aislamiento de declaraciones</h2><p>La nueva opcion <code>isolatedDeclarations</code> garantiza que los archivos .d.ts puedan generarse sin analizar dependencias, critico para monorepos y herramientas de build paralelas.</p><h2>Vale la pena actualizar?</h2><p>Si, sin dudarlo. La migracion es no-breaking en la inmensa mayoria de los casos.</p>',
      author: u('Sofia Ramirez'), category: c('Programación'),
      tags: ['typescript','javascript','tipos','frontend'],
      status: 'published', publishedAt: d(7),
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80',
      views: 1284,
    },
    {
      title: 'Los 7 principios de la productividad que realmente funcionan',
      slug:  'siete-principios-productividad-que-funcionan',
      excerpt: 'Despues de probar decenas de sistemas y metodologias, estos son los 7 principios que han sobrevivido a anos de uso real. Sin hype, sin apps magicas.',
      content: '<h2>Principio 1: La energia, no el tiempo</h2><p>Gestionar el tiempo sin gestionar la energia es como optimizar el codigo en un servidor apagado. Tu capacidad cognitiva fluctua durante el dia — aprende cuando eres mas agudo y protege esas horas para el trabajo profundo.</p><h2>Principio 2: Una lista, no diez</h2><p>Tener multiples sistemas de tareas garantiza que nada tenga prioridad real. Elige un lugar canonico para tus compromisos y respetalo.</p><h2>Principio 3: La tarea de una sola cosa</h2><p>Cada manana, escribe la unica cosa que, si la haces hoy, el dia habra valido la pena. Haz esa primero.</p><h2>Principio 4: Los bloques de tiempo</h2><p>Las tareas se expanden para llenar el tiempo disponible (Ley de Parkinson). Los bloques de tiempo crean urgencia artificial que acelera la ejecucion.</p><h2>Principio 5: El ritual de cierre</h2><p>Termina cada dia con 10 minutos de revision: que hice, que queda pendiente, que va manana. Esto libera la mente para desconectarse de verdad.</p><h2>Principio 6: El no como estrategia</h2><p>Cada si a algo es un no a otra cosa. Los profesionales mas productivos dicen no con mucha mas frecuencia.</p><h2>Principio 7: Sistemas, no fuerza de voluntad</h2><p>La fuerza de voluntad es finita. Los habitos y sistemas funcionan cuando la motivacion no esta.</p>',
      author: u('Administrador'), category: c('Productividad'),
      tags: ['productividad','habitos','trabajo','metodologia'],
      status: 'published', publishedAt: d(25),
      coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80',
      views: 2089,
    },
    {
      title: 'Introduccion a los Web Components nativos',
      slug:  'introduccion-web-components-nativos',
      excerpt: 'Custom Elements, Shadow DOM y HTML Templates: la trilogia que permite crear componentes reutilizables sin frameworks.',
      content: '<h2>Que son los Web Components?</h2><p>Son un conjunto de APIs nativas del navegador que permiten crear elementos HTML personalizados, encapsulados y reutilizables — sin depender de React, Vue ni Angular.</p><h2>Custom Elements</h2><p>La base de todo. Con <code>customElements.define()</code> registras un elemento que el navegador tratara como cualquier tag HTML nativo.</p><h2>Shadow DOM</h2><p>Encapsulacion real: el CSS y el DOM interno de tu componente no se mezclan con el resto de la pagina.</p><p><em>Articulo en progreso...</em></p>',
      author: u('Sofia Ramirez'), category: c('Tutoriales'),
      tags: ['web components','javascript','html'],
      status: 'draft', publishedAt: null,
      coverImage: '', views: 0,
    },
    {
      title: 'El estado del Open Source en 2025: luces y sombras',
      slug:  'estado-open-source-2025',
      excerpt: 'Fundaciones, licencias, sostenibilidad economica y la nueva ola de proyectos que estan redefiniendo que significa ser open source hoy.',
      content: '<h2>Un ecosistema en tension</h2><p>Open Source nunca fue tan popular — ni tan fragil. El mismo software que impulsa billones de dolares en infraestructura global es mantenido frecuentemente por una o dos personas en su tiempo libre.</p><h2>El problema de la sostenibilidad</h2><p>El caso de log4j en 2021 dejo claro que la cadena de suministro de software libre tiene puntos de fallo criticos. En 2025, las conversaciones sobre sostenibilidad ya no son opcionales.</p><h2>Nuevos modelos</h2><p>Open Core, dual licensing, patrocinios corporativos, bounties — el ecosistema esta experimentando activamente. No hay una respuesta correcta todavia.</p>',
      author: u('Administrador'), category: c('Opinión'),
      tags: ['open source','comunidad','sostenibilidad'],
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 3 * 86400000),
      publishedAt: null,
      coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&q=80',
      views: 0,
    },
    // ── 11 · Carlos ──────────────────────────────────────────
    {
      title: 'PostgreSQL vs MongoDB en 2025: cuando usar cada uno',
      slug:  'postgresql-vs-mongodb-2025',
      excerpt: 'La guerra de las bases de datos no tiene ganador universal. Analizamos los casos de uso reales donde cada uno brilla de verdad.',
      content: '<h2>No es una competencia</h2><p>La pregunta correcta no es cual es mejor, sino <strong>cual resuelve mejor tu problema especifico</strong>.</p><h2>PostgreSQL brilla cuando...</h2><ul><li>Los datos tienen relaciones complejas</li><li>La consistencia ACID es critica</li><li>Necesitas transacciones multi-tabla</li></ul><h2>MongoDB brilla cuando...</h2><ul><li>El esquema evoluciona rapidamente</li><li>Los datos son naturalmente jerarquicos</li><li>Necesitas escalar horizontalmente sin friction</li></ul><h2>El veredicto honesto</h2><p>Para la mayoria de aplicaciones web, <strong>PostgreSQL</strong> es la eleccion mas solida. MongoDB sufrió de over-hype historico pero tiene casos de uso validos.</p>',
      author: u('Carlos Mendoza'), category: c('Tecnología'),
      tags: ['postgresql','mongodb','bases de datos','backend'],
      status: 'published', publishedAt: d(18),
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80',
      views: 1730,
    },
    // ── 12 · Valentina ────────────────────────────────────────
    {
      title: 'Figma en 2025: todo lo nuevo que debes conocer',
      slug:  'figma-2025-novedades',
      excerpt: 'Variables, Dev Mode mejorado, prototipado avanzado y la integracion con IA. El flujo de trabajo de diseno cambio para siempre.',
      content: '<h2>Variables: el cambio mas importante</h2><p>Las variables de Figma permiten crear sistemas de diseno verdaderamente dinamicos con modos de color, densidad y tipografia intercambiables en un clic.</p><h2>Dev Mode y la brecha diseno-desarrollo</h2><p>Anotaciones automaticas, inspeccion mejorada y conexion directa con Storybook y repositorios de codigo.</p><h2>IA generativa integrada</h2><p>First Draft genera layouts a partir de descripciones en lenguaje natural. No reemplaza al disenador — acelera la fase de exploracion.</p>',
      author: u('Valentina Cruz'), category: c('Diseño'),
      tags: ['figma','diseno','ux','herramientas'],
      status: 'published', publishedAt: d(10),
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
      views: 1456,
    },
    // ── 13 · Sofia ────────────────────────────────────────────
    {
      title: 'Construye tu primer API REST con Node.js y Express desde cero',
      slug:  'api-rest-nodejs-express-desde-cero',
      excerpt: 'Tutorial completo paso a paso: desde npm init hasta un API en produccion con autenticacion JWT y validacion de datos.',
      content: '<h2>Lo que vas a construir</h2><p>Una API REST completa con CRUD, autenticacion JWT, validacion de inputs y manejo de errores — en menos de 200 lineas.</p><h2>Setup inicial</h2><pre><code>npm init -y\nnpm install express mongoose jsonwebtoken bcryptjs dotenv</code></pre><h2>Estructura recomendada</h2><pre><code>src/\n  controllers/\n  models/\n  routes/\n  middlewares/\nserver.js</code></pre><h2>Autenticacion JWT</h2><p>Un middleware que verifica el token en cada request protegido. Simple, stateless y escalable.</p>',
      author: u('Sofia Ramirez'), category: c('Tutoriales'),
      tags: ['nodejs','express','api','tutorial','backend'],
      status: 'published', publishedAt: d(22),
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
      views: 3847,
    },
    // ── 14 · Carlos ───────────────────────────────────────────
    {
      title: 'Docker para desarrolladores: la guia que desearía haber tenido',
      slug:  'docker-para-desarrolladores-guia',
      excerpt: 'Contenedores, imagenes, volumes, networks y Docker Compose explicados con ejemplos reales de desarrollo web.',
      content: '<h2>Por que Docker cambio mi vida</h2><p>Antes: "funciona en mi maquina". Despues: el entorno de desarrollo es identico al de produccion.</p><h2>Conceptos clave</h2><p><strong>Imagen</strong>: la receta. <strong>Contenedor</strong>: la instancia. <strong>Dockerfile</strong>: las instrucciones.</p><pre><code>FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json .\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD ["node","server.js"]</code></pre><h2>Docker Compose</h2><p>Levanta app, base de datos y cache con un solo <code>docker compose up</code>.</p>',
      author: u('Carlos Mendoza'), category: c('Tutoriales'),
      tags: ['docker','devops','contenedores','tutorial'],
      status: 'published', publishedAt: d(35),
      coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&q=80',
      views: 2614,
    },
    // ── 15 · Admin ────────────────────────────────────────────
    {
      title: 'Los 10 errores mas caros de las startups tecnologicas',
      slug:  'diez-errores-startups-tecnologicas',
      excerpt: 'Despues de analizar cientos de post-mortems, estos son los patrones de fallo que se repiten una y otra vez.',
      content: '<h2>Error 1: Construir antes de validar</h2><p>El 42% de las startups fracasan por falta de mercado. Habla con 20 clientes potenciales antes de escribir una linea de codigo.</p><h2>Error 2: El equipo equivocado</h2><p>Las startups no mueren por mala tecnologia — mueren por problemas de equipo.</p><h2>Error 3: Escalar prematuramente</h2><p>Contratar y expandirse antes de tener product-market fit es el camino rapido al fracaso.</p><h2>Error 4: Ignorar la retencion</h2><p>Adquirir usuarios es glamoroso. Retenerlos es lo que construye un negocio real.</p>',
      author: u('Administrador'), category: c('Opinión'),
      tags: ['startups','emprendimiento','negocios','tecnologia'],
      status: 'published', publishedAt: d(40),
      coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
      views: 4201,
    },
    // ── 16 · Valentina ────────────────────────────────────────
    {
      title: 'Tipografia en interfaces digitales: mas alla de elegir una fuente',
      slug:  'tipografia-interfaces-digitales',
      excerpt: 'Escala tipografica, ritmo vertical, combinacion de familias y legibilidad en pantalla. Lo que todo developer deberia saber sobre tipos.',
      content: '<h2>Por que la tipografia importa</h2><p>El 95% del contenido web es texto. Si la tipografia falla, la interfaz falla.</p><h2>La escala tipografica</h2><p>Una escala matematica (Minor Third, Perfect Fourth) garantiza armonia visual automaticamente sin decisiones arbitrarias.</p><h2>Combinando familias</h2><p>Contraste sin conflicto: una serif expresiva para titulos mas una sans-serif limpia para cuerpo es casi infalible.</p><h2>Reglas de legibilidad</h2><ul><li>Linea ideal: 60-75 caracteres</li><li>Line-height cuerpo: 1.5-1.7</li><li>Minimo 16px para texto principal</li></ul>',
      author: u('Valentina Cruz'), category: c('Diseño'),
      tags: ['tipografia','diseno','ux','fuentes'],
      status: 'published', publishedAt: d(28),
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
      views: 867,
    },
    // ── 17 · Sofia ────────────────────────────────────────────
    {
      title: 'Accesibilidad web: el checklist que uso en cada proyecto',
      slug:  'accesibilidad-web-checklist',
      excerpt: 'WCAG 2.2, ARIA, navegacion por teclado y lectores de pantalla. Guia practica para hacer la web mas inclusiva.',
      content: '<h2>Por que no es opcional</h2><p>1 de cada 7 personas tiene alguna discapacidad. Y en muchos paises la accesibilidad digital es requisito legal.</p><h2>El checklist basico</h2><ul><li>Contraste minimo 4.5:1 para texto normal</li><li>Todos los elementos interactivos accesibles por teclado</li><li>Imagenes con alt text descriptivo</li><li>Estructura de headings logica h1→h2→h3</li></ul><h2>El test definitivo</h2><p>Desconecta el mouse. Si no puedes completar el flujo principal solo con Tab, tienes trabajo por hacer.</p>',
      author: u('Sofia Ramirez'), category: c('Tutoriales'),
      tags: ['accesibilidad','wcag','ux','html'],
      status: 'published', publishedAt: d(33),
      coverImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80',
      views: 1123,
    },
    // ── 18 · Carlos ───────────────────────────────────────────
    {
      title: 'Arquitectura limpia en Node.js: del caos al orden',
      slug:  'arquitectura-limpia-nodejs',
      excerpt: 'Capas, separacion de responsabilidades e inyeccion de dependencias. Como estructurar aplicaciones Node.js que escalen de verdad.',
      content: '<h2>El problema del spaghetti</h2><p>Todo proyecto empieza ordenado. Con el tiempo la logica de negocio se mezcla con el acceso a datos y las rutas crecen a 300 lineas.</p><h2>Las capas</h2><p><strong>Entidades</strong> → <strong>Casos de uso</strong> → <strong>Adaptadores</strong> → <strong>Frameworks</strong>. Las capas internas no conocen a las externas.</p><pre><code>src/\n  domain/         ← logica pura\n  application/    ← casos de uso\n  infrastructure/ ← DB, APIs\n  interfaces/     ← controllers</code></pre><h2>El beneficio real</h2><p>Cambia Express por Fastify o MongoDB por PostgreSQL sin tocar la logica de negocio.</p>',
      author: u('Carlos Mendoza'), category: c('Programación'),
      tags: ['arquitectura','nodejs','backend','clean code'],
      status: 'published', publishedAt: d(45),
      coverImage: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&q=80',
      views: 1988,
    },
    // ── 19 · Admin ────────────────────────────────────────────
    {
      title: 'El burnout del desarrollador: senales, causas y como salir',
      slug:  'burnout-desarrollador-senales-causas',
      excerpt: 'Nadie habla suficiente de salud mental en tecnologia. Una conversacion honesta sobre el agotamiento en nuestra industria.',
      content: '<h2>Mas comun de lo que admitimos</h2><p>El 58% de los desarrolladores experimentan burnout en algun momento. El estigma hace que sea un tema tabú.</p><h2>Senales tempranas</h2><ul><li>El codigo que antes era divertido ahora se siente una carga</li><li>Procrastinacion constante en tareas que antes completabas rapido</li><li>Irritabilidad en code reviews</li></ul><h2>Las causas sistemicas</h2><p>Deadlines irreales, falta de autonomia y cultura de crunch son los verdaderos culpables — no la debilidad individual.</p><h2>Como salir</h2><p>Reconocerlo. Hablar con alguien. Recuperar los limites que fuiste cediendo.</p>',
      author: u('Administrador'), category: c('Carrera'),
      tags: ['salud mental','burnout','carrera','bienestar'],
      status: 'published', publishedAt: d(50),
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
      views: 5340,
    },
    // ── 20 · Valentina ────────────────────────────────────────
    {
      title: 'Sistema de diseno desde cero: la guia definitiva',
      slug:  'sistema-diseno-desde-cero',
      excerpt: 'Tokens, componentes, documentacion y gobierno. Como construir un design system que el equipo realmente adopte y use.',
      content: '<h2>Por que la mayoria fracasan</h2><p>No por falta de componentes bonitos — por falta de adopcion. Un sistema que nadie usa es documentacion cara.</p><h2>Empieza por los tokens</h2><p>Colores, tipografia, espaciado, radios, sombras. Todo lo demas se construye sobre ellos.</p><h2>La regla del 80/20</h2><p>El 80% de la UI usa el 20% de los componentes. Haz boton, input, card, modal y tabla perfectos antes de continuar.</p><h2>Documentacion que se usa</h2><p>Ejemplos interactivos con codigo copiable valen 10 veces mas que documentacion estatica.</p>',
      author: u('Valentina Cruz'), category: c('Diseño'),
      tags: ['design system','diseno','componentes','ux'],
      status: 'published', publishedAt: d(55),
      coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80',
      views: 2234,
    },
    // ── 21 · Sofia ────────────────────────────────────────────
    {
      title: 'Testing en JavaScript: la guia que necesitabas',
      slug:  'testing-javascript-guia-completa',
      excerpt: 'Unit tests, integration tests, e2e y TDD con las herramientas del ecosistema moderno. Por fin entenderas que testear y que no.',
      content: '<h2>La piramide del testing</h2><p>Muchos unit tests, pocos integration, muy pocos e2e. No al reves.</p><h2>Vitest: el nuevo estandar</h2><p>Mismo API que Jest, 10x mas rapido gracias a transformacion nativa de ESM.</p><h2>Que testear</h2><p>Logica de negocio critica, funciones puras, edge cases conocidos. Testea comportamiento, no implementacion.</p><h2>TDD en la practica</h2><p>Red → Green → Refactor. Escribe el test que falla, hazlo pasar con el minimo codigo posible, luego refactoriza.</p>',
      author: u('Sofia Ramirez'), category: c('Programación'),
      tags: ['testing','javascript','vitest','tdd'],
      status: 'published', publishedAt: d(60),
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      views: 1876,
    },
    // ── 22 · Carlos ───────────────────────────────────────────
    {
      title: 'Redis: el arma secreta que todo backend deberia usar',
      slug:  'redis-arma-secreta-backend',
      excerpt: 'Cache, sesiones, pub/sub, rate limiting y colas de trabajo. Redis hace muchas cosas y las hace excepcionalmente bien.',
      content: '<h2>Mas que un cache</h2><p>Redis es una base de datos en memoria con estructuras ricas: strings, hashes, listas, sets, sorted sets y streams.</p><h2>El caso de uso mas comun</h2><p>Cache de consultas costosas. 200ms en PostgreSQL → 1ms desde Redis.</p><pre><code>const cached = await redis.get(key);\nif (cached) return JSON.parse(cached);\nconst data = await db.query(heavyQuery);\nawait redis.setex(key, 3600, JSON.stringify(data));</code></pre><h2>Rate limiting elegante</h2><p>Con INCR y TTL implementas rate limiting sin una sola tabla extra en tu DB principal.</p>',
      author: u('Carlos Mendoza'), category: c('Tecnología'),
      tags: ['redis','backend','cache','performance'],
      status: 'published', publishedAt: d(38),
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
      views: 1654,
    },
    // ── 23 · Admin ────────────────────────────────────────────
    {
      title: 'Remote work en tecnologia: lo que nadie te dijo antes de empezar',
      slug:  'remote-work-tecnologia-realidad',
      excerpt: 'Despues de 5 anos trabajando 100% remoto, esto es lo que desearía haber sabido el primer dia.',
      content: '<h2>La soledad que nadie menciona</h2><p>Los articulos hablan de flexibilidad. Pocos mencionan que el aislamiento social es real y requiere esfuerzo activo.</p><h2>El espacio importa</h2><p>Trabajar desde el sofa destruye concentracion y espalda. Buena silla y escritorio es la mejor inversion del trabajo remoto.</p><h2>Comunicacion asincrona es una habilidad</h2><p>Mensajes claros, autocontenidos y accionables diferencian a los mejores trabajadores remotos.</p><h2>Rituales de transicion</h2><p>Sin commute, crea rituales artificiales de inicio y cierre: cafe de manana, caminata al terminar.</p>',
      author: u('Administrador'), category: c('Productividad'),
      tags: ['remote work','trabajo remoto','productividad','carrera'],
      status: 'published', publishedAt: d(62),
      coverImage: 'https://images.unsplash.com/photo-1521898284481-a5ec348cb555?w=1200&q=80',
      views: 3122,
    },
    // ── 24 · Valentina ────────────────────────────────────────
    {
      title: 'Micro-interacciones: el detalle que separa lo bueno de lo memorable',
      slug:  'micro-interacciones-diseno-ux',
      excerpt: 'Esas pequenas animaciones y respuestas visuales que hacen que una interfaz se sienta viva. Principios y ejemplos reales.',
      content: '<h2>Que es una micro-interaccion?</h2><p>Un momento de retroalimentacion entre usuario e interfaz: el toggle que hace clic, el like que explota en particulas, el boton que confirma con un check.</p><h2>Los 4 componentes</h2><p><strong>Trigger</strong> → <strong>Rules</strong> → <strong>Feedback</strong> → <strong>Loops & Modes</strong>.</p><h2>Cuando ayudan y cuando molestan</h2><p>Bien disenadas comunican estado y reducen ansiedad. Mal disenadas solo agregan latencia percibida.</p><h2>La regla de los 100ms</h2><p>El cerebro percibe respuestas menores a 100ms como instantaneas. Dentro de ese umbral, el feedback se siente nativo.</p>',
      author: u('Valentina Cruz'), category: c('Diseño'),
      tags: ['animacion','ux','micro-interacciones','diseno'],
      status: 'published', publishedAt: d(70),
      coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80',
      views: 945,
    },
    // ── 25 · Sofia ────────────────────────────────────────────
    {
      title: 'Next.js 15: todo lo que cambia en el App Router',
      slug:  'nextjs-15-app-router-cambios',
      excerpt: 'Partial Prerendering estable, mejoras en caching, Turbopack por defecto y la nueva API de Forms.',
      content: '<h2>Partial Prerendering</h2><p>Combina SSG y SSR: un shell estatico instantaneo con partes dinamicas en streaming. Sin cambios en el codigo del componente.</p><h2>Caching mas predecible</h2><p>El comportamiento ahora es opt-in y explicito — uno de los principales puntos de friccion de la v14 resuelto.</p><h2>Turbopack estable</h2><p>Bundler en Rust listo para produccion. Compilaciones 40-70% mas rapidas en proyectos grandes.</p><h2>La nueva API de Forms</h2><p><code>useActionState</code> y <code>useFormStatus</code> simplifican formularios con Server Actions. Menos codigo, mejor UX.</p>',
      author: u('Sofia Ramirez'), category: c('Programación'),
      tags: ['nextjs','react','javascript','frontend'],
      status: 'published', publishedAt: d(14),
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      views: 2789,
    },
  ];
};

/* ═══════════════════════ COMENTARIOS ═══════════════════════ */
const makeComments = (users, posts) => {
  const p = (s) => posts.find(x => x.slug === s)?._id;
  const u = (n) => users.find(x => x.name === n)?._id;
  return [
    // Post 1
    { post: p('futuro-inteligencia-artificial-2025'),    author: u('Sofia Ramirez'),  content: 'Excelente analisis. Lo que mas me preocupa es la parte de los agentes autonomos — la responsabilidad legal cuando algo sale mal sigue sin estar clara.', approved: true },
    { post: p('futuro-inteligencia-artificial-2025'),    author: u('Carlos Mendoza'), content: 'Comparto la preocupacion sobre el mercado laboral. Aunque historicamente la tecnologia crea mas empleos de los que destruye, el ritmo de este cambio es diferente.', approved: true },
    { post: p('futuro-inteligencia-artificial-2025'),    author: u('Valentina Cruz'), content: 'Tienen alguna fuente sobre las estadisticas de adopcion? Me gustaria profundizar en los datos.', approved: true },
    // Post 2
    { post: p('react-19-todo-lo-que-necesitas-saber'),   author: u('Carlos Mendoza'), content: 'Llevaba meses esperando que los Server Components se estabilizaran. Ahora si puedo empezar a migrar el proyecto principal.', approved: true },
    { post: p('react-19-todo-lo-que-necesitas-saber'),   author: u('Administrador'),  content: 'El compilador automatico es lo que mas me entusiasma. Cuantas horas perdidas memorizando todo manualmente...', approved: true },
    { post: p('react-19-todo-lo-que-necesitas-saber'),   author: u('Valentina Cruz'), content: 'Pregunta: el nuevo compilador es compatible con librerias de terceros que usan useMemo internamente?', approved: false },
    // Post 3
    { post: p('guia-completa-css-grid-2025'),            author: u('Carlos Mendoza'), content: 'El subgrid merece un articulo propio. Llevo anos esperando esa funcionalidad para el problema de las tarjetas con altura variable.', approved: true },
    { post: p('guia-completa-css-grid-2025'),            author: u('Administrador'),  content: 'Tutorial muy bien estructurado. Planeas hacer una parte 2 con animaciones de grid?', approved: true },
    // Post 4
    { post: p('nodejs-vs-bun-vs-deno-2025'),             author: u('Sofia Ramirez'),  content: 'Uso Bun en produccion desde hace 6 meses en un microservicio de alta carga. Los tiempos de respuesta son notablemente mejores.', approved: true },
    { post: p('nodejs-vs-bun-vs-deno-2025'),             author: u('Valentina Cruz'), content: 'Alguna experiencia con Deno Deploy en edge? Estoy evaluando si migrar algunos endpoints.', approved: true },
    { post: p('nodejs-vs-bun-vs-deno-2025'),             author: u('Administrador'),  content: 'Falta mencionar el soporte empresarial — para muchas organizaciones, tener soporte oficial de un vendor es no negociable.', approved: false },
    // Post 6
    { post: p('junior-a-senior-sin-quemarte'),           author: u('Sofia Ramirez'),  content: 'El punto de la escritura es el que mas resuena. He visto developers tecnicamente brillantes que no escalan porque nadie entiende sus PRs.', approved: true },
    { post: p('junior-a-senior-sin-quemarte'),           author: u('Valentina Cruz'), content: 'Agregaria: aprender a dar y recibir feedback. Es una habilidad que se puede entrenar y que marca una diferencia enorme.', approved: true },
    { post: p('junior-a-senior-sin-quemarte'),           author: u('Carlos Mendoza'), content: 'Muy de acuerdo con el T-shape. Mi error de junior fue intentar ser generalista puro.', approved: true },
    // Post 8
    { post: p('siete-principios-productividad-que-funcionan'), author: u('Sofia Ramirez'),  content: 'El ritual de cierre es transformador. Lo implemente hace 3 meses y la diferencia en calidad de descanso es notable.', approved: true },
    { post: p('siete-principios-productividad-que-funcionan'), author: u('Carlos Mendoza'), content: 'Recomendarias alguna herramienta especifica para gestionar los bloques de tiempo?', approved: true },
    // Post 13
    { post: p('api-rest-nodejs-express-desde-cero'),     author: u('Carlos Mendoza'), content: 'Tutorial solido. Sugiero agregar una seccion sobre rate limiting — es algo que mucha gente omite en el primer deploy.', approved: true },
    { post: p('api-rest-nodejs-express-desde-cero'),     author: u('Administrador'),  content: 'El mejor tutorial de Express que he leido este ano. La estructura es muy cercana a como lo hacemos en produccion.', approved: true },
    { post: p('api-rest-nodejs-express-desde-cero'),     author: u('Valentina Cruz'), content: 'Lo segui paso a paso y funciono perfecto. Gracias por incluir el manejo de errores — es lo que siempre falta.', approved: true },
    // Post 14
    { post: p('docker-para-desarrolladores-guia'),       author: u('Sofia Ramirez'),  content: 'El Dockerfile multi-stage merece un articulo propio. Redujo nuestra imagen de 800MB a 120MB.', approved: true },
    { post: p('docker-para-desarrolladores-guia'),       author: u('Administrador'),  content: 'Finalmente un tutorial de Docker que no asume que ya sabes Kubernetes. Muy bien explicado.', approved: true },
    // Post 19
    { post: p('burnout-desarrollador-senales-causas'),   author: u('Sofia Ramirez'),  content: 'Gracias por escribir esto. Pase por burnout el ano pasado y reconocer las senales hubiera ayudado antes.', approved: true },
    { post: p('burnout-desarrollador-senales-causas'),   author: u('Carlos Mendoza'), content: 'El punto sobre causas sistemicas es crucial. Demasiadas veces se responsabiliza al individuo de lo que es un problema de organizacion.', approved: true },
    { post: p('burnout-desarrollador-senales-causas'),   author: u('Valentina Cruz'), content: 'En mi equipo implementamos "no meetings Friday" y la diferencia en el estado de animo es notable.', approved: true },
    // Post 11
    { post: p('postgresql-vs-mongodb-2025'),             author: u('Sofia Ramirez'),  content: 'Totalmente de acuerdo. El over-hype de MongoDB de los 2010s nos costo caro a muchos.', approved: true },
    { post: p('postgresql-vs-mongodb-2025'),             author: u('Valentina Cruz'), content: 'Lo que no menciona: el soporte JSON de PostgreSQL lo hace competitivo tambien en datos semi-estructurados.', approved: true },
    // Post 25
    { post: p('nextjs-15-app-router-cambios'),           author: u('Carlos Mendoza'), content: 'El Partial Prerendering resuelve el problema del TTFB en apps dinamicas de forma muy elegante.', approved: true },
    { post: p('nextjs-15-app-router-cambios'),           author: u('Administrador'),  content: 'Las mejoras de predictibilidad en caching me hacen querer volver a Next.js despues de meses evitandolo.', approved: true },
  ];
};

/* ═══════════════════════ MAIN SEED ═══════════════════════ */
const seedAdmin = async () => {
  try {
    const alreadySeeded = await Post.countDocuments();
    if (alreadySeeded > 0) {
      console.log('✅ Seed ya aplicado — saltando.');
      return;
    }

    // 1. Categorias
    let cats = await Category.find();
    if (!cats.length) {
      cats = await Category.insertMany(CATEGORIES.map(c => ({ ...c, slug: slugify(c.name) })));
      console.log(`🏷  ${cats.length} categorias creadas`);
    }

    // 2. Usuarios
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const users = [];
    for (const u of DEMO_USERS) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create({ name: u.name, email: u.email, role: u.role, bio: u.bio, password: await bcrypt.hash(u.password, salt) });
        console.log(`👤 Usuario creado: ${u.email}`);
      }
      users.push(existing);
    }

    // 3. Posts
    const posts = await Post.insertMany(makePosts(users, cats));
    console.log(`📝 ${posts.length} articulos creados`);

    // 4. Comentarios
    const comments = await Comment.insertMany(makeComments(users, posts));
    console.log(`💬 ${comments.length} comentarios creados`);

    console.log('🎉 Seed completo — BlogX listo para presentar');
    console.log('');
    console.log('  Cuentas disponibles:');
    console.log('  ┌──────────────────────────┬──────────────┬──────────┐');
    console.log('  │ Email                    │ Contraseña   │ Rol      │');
    console.log('  ├──────────────────────────┼──────────────┼──────────┤');
    console.log('  │ admin@blogx.com          │ admin123     │ Admin    │');
    console.log('  │ sofia@blogx.com          │ autor123     │ Autora   │');
    console.log('  │ carlos@blogx.com         │ autor123     │ Autor    │');
    console.log('  │ valentina@blogx.com      │ autor123     │ Autora   │');
    console.log('  └──────────────────────────┴──────────────┴──────────┘');

  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    console.error(err.stack);
  }
};

module.exports = seedAdmin;

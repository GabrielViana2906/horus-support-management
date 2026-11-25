/**
 * Simulador de banco de dados local usando localStorage.
 * Estrutura esperada em horus_db_v1:
 * {
 *   customers: [],           // lista de clientes { id, nome, email, empresa, role }
 *   agents: [],              // lista de agentes { id, nome, email, role }
 *   tickets: [],             // lista de tickets
 *   settings: {              // configurações gerais
 *     tema: "claro",
 *     lembrar: false,
 *     email: ""
 *   }
 * }
 *
 * Função initDB(): preenche 10 empresas fictícias na primeira execução
 * se não houver clientes cadastrados ainda.
 */

const DB_KEY = "horus_db_v1";

const FICTITIOUS_COMPANIES = [
  { nome: "Acme Industries", email: "contato@acme.com" },
  { nome: "Beta Soluções", email: "ola@beta.com.br" },
  { nome: "Gamma Consultoria", email: "suporte@gamma.com" },
  { nome: "Delta Comércio", email: "vendas@delta.com.br" },
  { nome: "Epsilon Tech", email: "oi@epsilontech.com" },
  { nome: "Zeta Serviços", email: "atendimento@zeta.com.br" },
  { nome: "Eta Logística", email: "fretes@eta.com.br" },
  { nome: "Theta Seguros", email: "sinistro@theta.com.br" },
  { nome: "Iota Alimentos", email: "comercial@iota.com.br" },
  { nome: "Kappa Editora", email: "contato@kappa.com.br" }
];

const DEFAULT_COMPANIES = FICTITIOUS_COMPANIES.map((company, index) => ({
  id: index + 1,
  nome: company.nome
}));

const DEFAULT_QUEUES = [
  { id: "nao-avaliados", nome: "Não avaliados" },
  { id: "chamados-tecnicos", nome: "Chamados Técnicos" },
  { id: "projetos", nome: "Projetos" },
  { id: "chamados-licenca", nome: "Chamados de Licença" },
  { id: "negociacoes", nome: "Negociações" },
  { id: "financeiro", nome: "Financeiro" }
];

const DEFAULT_TEAMS = [
  {
    id: "nivel-1",
    nome: "Nível 1",
    descricao: "Triagem inicial, dúvidas operacionais e atendimentos rápidos.",
    membros: []
  },
  {
    id: "nivel-2",
    nome: "Nível 2",
    descricao: "Análise técnica intermediária, incidentes de aplicação e integrações.",
    membros: []
  },
  {
    id: "nivel-3",
    nome: "Nível 3",
    descricao: "Infraestrutura crítica, bugs complexos e escalonamento especializado.",
    membros: []
  },
  {
    id: "marketing",
    nome: "Marketing",
    descricao: "Demandas de campanhas, comunicação e materiais institucionais.",
    membros: []
  },
  {
    id: "licenca",
    nome: "Licença",
    descricao: "Gestão de licenciamento, renovações, acessos e ativações.",
    membros: []
  }
];

function generateRandomDigits(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

function generateUniqueId(existingIds, buildCandidate) {
  const existingSet = new Set(existingIds.map((id) => String(id)));
  let candidate = buildCandidate();

  while (existingSet.has(candidate)) {
    candidate = buildCandidate();
  }

  return candidate;
}

/**
 * Inicializa o banco com empresas e clientes fictícios se ainda não existirem.
 * Chamar assim que o módulo é importado (useEffect no cliente).
 */
export function initFictitiousCompanies() {
  const db = getDB();
  let updated = false;

  if (!db.companies || db.companies.length === 0) {
    db.companies = DEFAULT_COMPANIES;
    updated = true;
  }

  if (!db.queues || db.queues.length === 0) {
    db.queues = DEFAULT_QUEUES;
    updated = true;
  }

  if (!db.teams || db.teams.length === 0) {
    db.teams = DEFAULT_TEAMS;
    updated = true;
  }

  const hasAdmin = (db.agents || []).some(
    (agent) => (agent.email || "").toLowerCase() === "admin"
  );

  if (!hasAdmin) {
    if (!db.agents) db.agents = [];
    const existingIds = db.agents.map((agent) => agent.id);
    const adminId = existingIds.includes("00000001")
      ? generateUniqueId(existingIds, () => generateRandomDigits(8))
      : "00000001";

    db.agents.push({
      id: adminId,
      nome: "Administrador",
      email: "admin",
      password: "admin",
      role: "agent",
      exigirTrocaSenha: 0,
      criadoEm: new Date().toISOString()
    });
    updated = true;
  }

  if (db.customers.length === 0) {
    const usedIds = [];
    db.customers = FICTITIOUS_COMPANIES.map((company) => {
      const id = generateUniqueId(usedIds, () => generateRandomDigits(8));
      usedIds.push(id);

      return {
        id,
        nome: company.nome,
        email: company.email,
        empresa: company.nome,
        role: "customer",
        criadoEm: new Date().toISOString()
      };
    });
    updated = true;
  }

  if (updated) {
    saveDB(db);
  }
}

/**
 * Lê o banco do localStorage.
 * Retorna a estrutura completa se houver dados, ou objeto vazio se não houver.
 * NÃO realiza migração automática de estruturas antigas.
 */
export function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      // Retorna estrutura vazia esperada
      return {
        customers: [],
        companies: [],
        queues: [],
        teams: [],
        agents: [],
        tickets: [],
        currentUser: null,
        settings: { tema: "claro", lembrar: false, email: "" }
      };
    }
    const parsed = JSON.parse(raw);
    // Garante que chaves existam
    return {
      customers: parsed.customers || [],
      companies: parsed.companies || [],
      queues: parsed.queues || [],
      teams: parsed.teams || [],
      agents: parsed.agents || [],
      tickets: parsed.tickets || [],
      currentUser: parsed.currentUser || null,
      settings: parsed.settings || { tema: "claro", lembrar: false, email: "" }
    };
  } catch (e) {
    console.error("Erro ao ler banco de dados:", e);
    // Em caso de erro, retorna estrutura vazia
    return {
      customers: [],
      companies: [],
      queues: [],
      teams: [],
      agents: [],
      tickets: [],
      currentUser: null,
      settings: { tema: "claro", lembrar: false, email: "" }
    };
  }
}

/**
 * Salva o objeto completo do banco no localStorage.
 */
export function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Erro ao salvar banco de dados:", e);
  }
}

/**
 * Customers
 */
export function getCustomers() {
  return getDB().customers;
}

export function setCustomers(customers) {
  const db = getDB();
  db.customers = customers;
  saveDB(db);
}

export function addCustomer(customer) {
  const db = getDB();
  if (!db.customers) db.customers = [];
  db.customers.push(customer);
  saveDB(db);
}

/**
 * Companies (pré-cadastradas)
 */
export function getCompanies() {
  const db = getDB();
  if (!db.companies || db.companies.length === 0) {
    db.companies = DEFAULT_COMPANIES;
    saveDB(db);
  }
  return db.companies;
}

/**
 * Queues (filas pré-cadastradas)
 */
export function getQueues() {
  const db = getDB();
  if (!db.queues || db.queues.length === 0) {
    db.queues = DEFAULT_QUEUES;
    saveDB(db);
  }
  return db.queues;
}

/**
 * Teams (equipes pré-cadastradas)
 */
export function getTeams() {
  const db = getDB();
  if (!db.teams || db.teams.length === 0) {
    db.teams = DEFAULT_TEAMS;
    saveDB(db);
  }
  return db.teams;
}

/**
 * Agents
 */
export function getAgents() {
  return getDB().agents;
}

export function setAgents(agents) {
  const db = getDB();
  db.agents = agents;
  saveDB(db);
}

export function addAgent(agent) {
  const db = getDB();
  if (!db.agents) db.agents = [];
  db.agents.push(agent);
  saveDB(db);
}

export function generateCustomerId() {
  const existingIds = getCustomers().map((customer) => customer.id);
  return generateUniqueId(existingIds, () => generateRandomDigits(8));
}

export function generateAgentId() {
  const existingIds = getAgents().map((agent) => agent.id);
  return generateUniqueId(existingIds, () => generateRandomDigits(8));
}

export function generateTicketId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePrefix = `${year}${month}${day}`;

  const existingIds = getTickets().map((ticket) => ticket.id);
  return generateUniqueId(
    existingIds,
    () => `${datePrefix}${generateRandomDigits(5)}`
  );
}

/**
 * Tickets
 */
export function getTickets() {
  return getDB().tickets;
}

export function setTickets(tickets) {
  const db = getDB();
  db.tickets = tickets;
  saveDB(db);
}

export function addTicket(ticket) {
  const db = getDB();
  if (!db.tickets) db.tickets = [];
  db.tickets.push(ticket);
  saveDB(db);
}

export function updateTicket(ticketId, updates) {
  const db = getDB();
  let updatedTicket = null;

  db.tickets = (db.tickets || []).map((ticket) => {
    if (String(ticket.id) === String(ticketId)) {
      updatedTicket = { ...ticket, ...updates };
      return updatedTicket;
    }
    return ticket;
  });

  if (updatedTicket) {
    saveDB(db);
  }

  return updatedTicket;
}

export function deleteTickets(ticketIds) {
  const idsToDelete = new Set(ticketIds.map((id) => String(id)));
  const db = getDB();
  db.tickets = (db.tickets || []).filter(
    (ticket) => !idsToDelete.has(String(ticket.id))
  );
  saveDB(db);
  return db.tickets;
}

/**
 * Settings (tema, lembrar de mim, e-mail)
 */
export function getSetting(key) {
  return getDB().settings[key];
}

export function setSetting(key, value) {
  const db = getDB();
  db.settings[key] = value;
  saveDB(db);
}

export function getSettings() {
  return getDB().settings;
}

export function setSettings(settings) {
  const db = getDB();
  db.settings = settings;
  saveDB(db);
}

export function getCurrentUser() {
  return getDB().currentUser;
}

export function setCurrentUser(user) {
  const db = getDB();
  db.currentUser = user;
  saveDB(db);
}

export function clearCurrentUser() {
  const db = getDB();
  db.currentUser = null;
  saveDB(db);
}
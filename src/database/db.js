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

/**
 * Inicializa o banco com empresas fictícias se não houver clientes.
 * Chamar assim que o módulo é importado (useEffect no cliente).
 */
export function initFictitiousCompanies() {
  const db = getDB();
  if (db.customers.length === 0) {
    const customersWithCompany = FICTITIOUS_COMPANIES.map(company => ({
      id: Date.now() + Math.random(), // IDs únicos
      nome: company.nome,
      email: company.email,
      empresa: company.nome,
      role: "customer",
      criadoEm: new Date().toISOString()
    }));
    setCustomers(customersWithCompany);
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
        agents: [],
        tickets: [],
        settings: { tema: "claro", lembrar: false, email: "" }
      };
    }
    const parsed = JSON.parse(raw);
    // Garante que chaves existam
    return {
      customers: parsed.customers || [],
      agents: parsed.agents || [],
      tickets: parsed.tickets || [],
      settings: parsed.settings || { tema: "claro", lembrar: false, email: "" }
    };
  } catch (e) {
    console.error("Erro ao ler banco de dados:", e);
    // Em caso de erro, retorna estrutura vazia
    return {
      customers: [],
      agents: [],
      tickets: [],
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
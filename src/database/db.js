/**
 * Simulador de banco de dados local usando localStorage.
 * Tudo é armazenado sob a chave 'horus_db_v1' com a seguinte estrutura:
 *
 * {
 *   customers: [],        // lista de clientes (antes 'clients')
 *   agents: [],           // lista de agentes cadastrados
 *   tickets: [],          // lista de tickets cadastrados
 *   settings: {           // configurações gerais do sistema
 *     tema: 'claro',      // tema atual ('claro' ou 'escuro')
 *     lembrar: false,     // "lembrar de mim" do login
 *     email: ''           // e-mail salvo para preenchimento automático
 *   }
 * }
 */

const DB_KEY = 'horus_db_v1';

const EMPTY_DB = {
  customers: [],
  agents: [],
  tickets: [],
  settings: {
    tema: 'claro',
    lembrar: false,
    email: ''
  }
};

/**
 * Lê todo o banco do localStorage. Retorna um novo banco vazio se não houver nada.
 * Faz migração de bancos antigos (chave 'clients' → 'customers', 'agent' → 'agents').
 */
export function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return { ...EMPTY_DB };
    const parsed = JSON.parse(raw);
    return {
      customers: Array.isArray(parsed.customers) ? parsed.customers : (Array.isArray(parsed.clients) ? parsed.clients : []),
      agents: Array.isArray(parsed.agents) ? parsed.agents : (parsed.agent ? [parsed.agent] : []),
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
      settings: parsed.settings || { ...EMPTY_DB.settings }
    };
  } catch (e) {
    console.error('Erro ao ler banco de dados:', e);
    return { ...EMPTY_DB };
  }
}

/**
 * Salva o objeto completo do banco no localStorage.
 */
export function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Erro ao salvar banco de dados:', e);
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
 * Configurações (tema, lembrar de mim, e-mail salvo)
 */
export function getSetting(key) {
  return getDB().settings[key];
}

export function setSetting(key, value) {
  const db = getDB();
  if (!db.settings) db.settings = { ...EMPTY_DB.settings };
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

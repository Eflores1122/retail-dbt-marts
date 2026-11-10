const DUCKDB_URL = "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.33.1-dev65.0/+esm";
const MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs";
const REPO = "https://github.com/Eflores1122/retail-dbt-marts/blob/main/";
const GROUPS = ["raw", "staging", "intermediate", "core", "published"];
const SVG_NS = "http://www.w3.org/2000/svg";

const COPY = {
  es: {
    title: "Marts de Mercado Alba",
    skip: "Saltar al resultado",
    navResult: "Resultado",
    navStores: "Tiendas",
    navDays: "Días",
    navProducts: "Productos",
    navLineage: "Linaje",
    navSql: "SQL",
    navTests: "Pruebas",
    navDefs: "Definiciones",
    lede: "Este navegador carga {seeds} CSV y ejecuta {models} modelos compilados por dbt {dbt}. Hay {tests} pruebas de datos. Las cifras de la hoja salen de esa corrida.",
    ledeWaiting: "Cargando el catálogo que produjo dbt compile.",
    windowNote: "dbt_project.yml fija la ventana del {start} al {end}. La fila de abajo, cuando exista, sale de marts.mart_business_kpis.",
    run: "Correr los marts con los seeds",
    rerun: "Volver a correr los marts",
    runBusy: "Corriendo los marts",
    loadingCatalog: "Cargando el catálogo compilado.",
    catalogError: "No se pudo leer catalog.json.",
    opening: "Abriendo DuckDB-WASM.",
    wasmError: "No se pudo cargar DuckDB-WASM desde jsDelivr.",
    loadingSeed: "Cargando {name}",
    building: "Construyendo {id}",
    modelsReady: "{models} modelos listos. Corriendo las pruebas.",
    ready: "Modelos listos.",
    failed: "La corrida se detuvo.",
    kpiTitle: "Hoja del periodo",
    metric: "Métrica",
    value: "Valor",
    kpiCaption: "Fuente: marts.mart_business_kpis, calculado en esta pestaña. Las tasas usan los centavos enteros de esa fila.",
    kpiEmpty: "Aún no hay fila. La corrida todavía no termina.",
    kpiWindow: "Ventana",
    kpiGmv: "GMV",
    kpiNet: "Ventas netas",
    kpiMargin: "Margen bruto",
    kpiMarginRatio: "Margen bruto / GMV",
    kpiOrders: "Pedidos",
    kpiCompleted: "Pedidos completados",
    kpiSaleOrders: "Pedidos con venta",
    kpiCancelled: "Pedidos cancelados",
    kpiAov: "Ticket promedio",
    kpiUnits: "Unidades vendidas",
    kpiLines: "Líneas",
    kpiReturn: "Tasa de devolución",
    kpiCancel: "Tasa de cancelación",
    kpiOnlineGmv: "Participación online del GMV",
    kpiOnlineOrders: "Participación online de pedidos",
    kpiStock: "Tasa de existencia",
    kpiCustomers: "Clientes",
    kpiNone: "Sin pedido completado (none)",
    kpiOne: "Una compra (one_time)",
    kpiReturning: "Recurrentes (returning)",
    kpiFrequent: "Frecuentes (frequent)",
    kpiActive: "Clientes activos",
    noteGmv: "Suma de líneas completed con line_type sale. No resta devoluciones.",
    noteReturn: "{returns} / {gmv} centavos",
    noteCancel: "{cancelled} / {orders} pedidos",
    noteOnline: "{online} / {gmv} centavos",
    noteOnlineOrders: "{online} / {orders} pedidos en mart_store_scorecard",
    noteStock: "{stock} / {positions} posiciones al {date}",
    noteActive: "{active} de {customers} clientes",
    noteAov: "gmv_centavos / 100 / completed_sale_orders",
    storesTitle: "Tiendas",
    storesWaiting: "El scorecard aparece al terminar los marts.",
    storesReconcile: "El scorecard suma {orders} pedidos y {gmv} centavos de GMV. La fila de KPIs tiene {kOrders} pedidos y {kGmv} centavos.",
    storesCaption: "Fuente: marts.mart_store_scorecard, ordenado por gmv_centavos.",
    colStore: "Tienda",
    colChannel: "Canal",
    colRegion: "Región",
    colOrders: "Pedidos",
    colGmv: "GMV (MXN)",
    colNet: "Venta neta (MXN)",
    colAov: "Ticket",
    colReturn: "Devolución",
    colCancel: "Cancelación",
    colStock: "Existencia",
    colBar: "GMV",
    dailyTitle: "Venta por día civil",
    dailyTableToggle: "Tabla de mart_daily_sales",
    dailyChartLabel: "Barras de GMV diario en MXN",
    dailyCaption: "GMV medio en día de semana, sin descanso: {week} MXN ({weekDays} días). GMV medio en sábado, domingo o descanso: {rest} MXN ({restDays} días). Descansos en dim_date: {holidays}.",
    dailyEmpty: "Sin filas diarias.",
    colDate: "Fecha",
    colUnits: "Unidades",
    productsTitle: "Productos",
    productsIntro: "Una fila por SKU en mart_product_performance. El filtro no vuelve a consultar: recorta las filas ya cargadas.",
    category: "Categoría",
    allCategories: "Todas",
    colSku: "SKU",
    colProduct: "Producto",
    colCategory: "Categoría",
    colBand: "Banda",
    colReturned: "Unidades devueltas",
    colMargin: "Margen (MXN)",
    colMarginRate: "Margen / GMV",
    colStockouts: "Posiciones en quiebre",
    productsCaption: "Fuente: marts.mart_product_performance.",
    lineageTitle: "Linaje",
    lineageIntro: "Cada nodo es una relación del manifest. La flecha sale de depends_on. Elige un nodo para ver el SQL compilado y consultarlo.",
    archTitle: "Arquitectura",
    archIntro: "El mismo corte del README, dibujado con Mermaid a partir de este proyecto.",
    sqlTitle: "Consulta",
    sqlIntro: "La sentencia corre en DuckDB dentro de esta pestaña, sobre raw, staging, intermediate y marts. Ctrl+Enter la ejecuta. La vista muestra como máximo 200 filas.",
    preset: "Consulta guardada",
    relation: "Relación",
    relationPlaceholder: "Elegir relación",
    sqlRun: "Ejecutar consulta",
    sqlRunning: "Ejecutando.",
    sqlRows: "{shown} filas en {ms} ms.",
    sqlTruncated: "Mostrando 200 filas. La consulta devolvió al menos 201. {ms} ms.",
    sqlStatement: "Sentencia ejecutada en {ms} ms.",
    sqlWaiting: "La consulta se habilita cuando los modelos terminan.",
    testsTitle: "Pruebas de dbt",
    testsIntro: "Cada prueba es el SQL compilado por dbt. Pasa si la consulta devuelve cero filas, la misma regla que dbt test.",
    testFilterLabel: "Filtrar",
    testsWaiting: "Las pruebas empiezan cuando los modelos terminan.",
    testsProgress: "Prueba {done} de {total}.",
    testsDone: "{passed} pasan, {failed} fallan, de {total}. {ms} ms.",
    pass: "pasa",
    fail: "falla",
    error: "error",
    showSql: "SQL",
    defsTitle: "Definiciones",
    defsIntro: "Las mismas reglas que models/marts y el README. Los nombres de columna se dejan como están en el almacén.",
    limitsTitle: "Límites",
    footerProject: "Mercado Alba es un minorista ficticio. Clientes, tiendas, productos, pedidos e inventario salen de scripts/generate_seeds.py con random.Random(42). Edgar Flores, Data/AI Engineer.",
    footerType: "El texto es IBM Plex Sans y el SQL es IBM Plex Mono, una familia de código abierto para lectura técnica. El verde #0F6E56 es el único acento: el verde de una etiqueta de caja de verdura, usado en la corrida y en las pruebas que pasan.",
    rows: "filas",
    depends: "Depende de",
    queryNode: "Consultar esta relación",
    rawSql: "SQL del modelo",
    compiledSql: "SQL compilado",
    columns: "Columnas",
    colName: "Columna",
    colDescription: "Descripción",
    seedNote: "Seed CSV. dbt lo carga en raw antes de staging.",
    group_raw: "raw · seeds",
    group_staging: "staging",
    group_intermediate: "intermediate",
    group_core: "dimensiones y hechos",
    group_published: "marts",
    state_pending: "pendiente",
    state_running: "corriendo",
    state_done: "listo",
    state_error: "error",
    mat_seed: "seed",
    mat_view: "vista",
    mat_table: "tabla",
    presetSegment: "Clientes por segmento",
    presetStores: "Scorecard de tiendas",
    presetDaily: "Venta diaria",
    presetProducts: "Productos por GMV",
    presetStock: "Existencia del cierre",
    presetCancelled: "Pedidos cancelados",
  },
  en: {
    title: "Mercado Alba marts",
    skip: "Skip to the result",
    navResult: "Result",
    navStores: "Stores",
    navDays: "Days",
    navProducts: "Products",
    navLineage: "Lineage",
    navSql: "SQL",
    navTests: "Tests",
    navDefs: "Definitions",
    lede: "This browser loads {seeds} CSVs and runs {models} models compiled by dbt {dbt}. There are {tests} data tests. The figures on the sheet come from that run.",
    ledeWaiting: "Loading the catalog produced by dbt compile.",
    windowNote: "dbt_project.yml sets the window from {start} through {end}. The row below, once it exists, comes from marts.mart_business_kpis.",
    run: "Run the marts on the example seeds",
    rerun: "Run the marts again",
    runBusy: "Running the marts",
    loadingCatalog: "Loading the compiled catalog.",
    catalogError: "Could not read catalog.json.",
    opening: "Opening DuckDB-WASM.",
    wasmError: "DuckDB-WASM could not be loaded from jsDelivr.",
    loadingSeed: "Loading {name}",
    building: "Building {id}",
    modelsReady: "{models} models ready. Running tests.",
    ready: "Models are ready.",
    failed: "The run stopped.",
    kpiTitle: "Period sheet",
    metric: "Metric",
    value: "Value",
    kpiCaption: "Source: marts.mart_business_kpis, calculated in this tab. Rates use the integer centavos on that row.",
    kpiEmpty: "No row yet. The run has not finished.",
    kpiWindow: "Window",
    kpiGmv: "GMV",
    kpiNet: "Net sales",
    kpiMargin: "Gross margin",
    kpiMarginRatio: "Gross margin / GMV",
    kpiOrders: "Orders",
    kpiCompleted: "Completed orders",
    kpiSaleOrders: "Completed sale orders",
    kpiCancelled: "Cancelled orders",
    kpiAov: "AOV",
    kpiUnits: "Units sold",
    kpiLines: "Order lines",
    kpiReturn: "Return rate",
    kpiCancel: "Cancel rate",
    kpiOnlineGmv: "Online share of GMV",
    kpiOnlineOrders: "Online share of orders",
    kpiStock: "In-stock rate",
    kpiCustomers: "Customers",
    kpiNone: "No completed order (none)",
    kpiOne: "One purchase (one_time)",
    kpiReturning: "Returning",
    kpiFrequent: "Frequent",
    kpiActive: "Active customers",
    noteGmv: "Sum of completed lines with line_type sale. Returns are not subtracted.",
    noteReturn: "{returns} / {gmv} centavos",
    noteCancel: "{cancelled} / {orders} orders",
    noteOnline: "{online} / {gmv} centavos",
    noteOnlineOrders: "{online} / {orders} orders on mart_store_scorecard",
    noteStock: "{stock} / {positions} positions on {date}",
    noteActive: "{active} of {customers} customers",
    noteAov: "gmv_centavos / 100 / completed_sale_orders",
    storesTitle: "Stores",
    storesWaiting: "The scorecard appears when the marts finish.",
    storesReconcile: "The scorecard sums to {orders} orders and {gmv} GMV centavos. The KPI row has {kOrders} orders and {kGmv} centavos.",
    storesCaption: "Source: marts.mart_store_scorecard, ordered by gmv_centavos.",
    colStore: "Store",
    colChannel: "Channel",
    colRegion: "Region",
    colOrders: "Orders",
    colGmv: "GMV (MXN)",
    colNet: "Net sales (MXN)",
    colAov: "AOV",
    colReturn: "Return rate",
    colCancel: "Cancel rate",
    colStock: "In stock",
    colBar: "GMV",
    dailyTitle: "Sales by civil day",
    dailyTableToggle: "mart_daily_sales table",
    dailyChartLabel: "Bars of daily GMV in MXN",
    dailyCaption: "Mean GMV on a weekday that is not a rest day: {week} MXN ({weekDays} days). Mean GMV on Saturday, Sunday, or a rest day: {rest} MXN ({restDays} days). Rest days in dim_date: {holidays}.",
    dailyEmpty: "No daily rows.",
    colDate: "Date",
    colUnits: "Units",
    productsTitle: "Products",
    productsIntro: "One row per SKU from mart_product_performance. The filter does not query again. It trims rows already loaded.",
    category: "Category",
    allCategories: "All",
    colSku: "SKU",
    colProduct: "Product",
    colCategory: "Category",
    colBand: "Band",
    colReturned: "Units returned",
    colMargin: "Margin (MXN)",
    colMarginRate: "Margin / GMV",
    colStockouts: "Stockout positions",
    productsCaption: "Source: marts.mart_product_performance.",
    lineageTitle: "Lineage",
    lineageIntro: "Each node is a relation from the manifest. The arrow follows depends_on. Pick a node to read the compiled SQL and query it.",
    archTitle: "Architecture",
    archIntro: "The same split as the README, drawn with Mermaid from this project.",
    sqlTitle: "Query",
    sqlIntro: "The statement runs in DuckDB inside this tab, on raw, staging, intermediate, and marts. Ctrl+Enter runs it. The view shows at most 200 rows.",
    preset: "Saved query",
    relation: "Relation",
    relationPlaceholder: "Choose a relation",
    sqlRun: "Run query",
    sqlRunning: "Running.",
    sqlRows: "{shown} rows in {ms} ms.",
    sqlTruncated: "Showing 200 rows. The query returned at least 201. {ms} ms.",
    sqlStatement: "Statement finished in {ms} ms.",
    sqlWaiting: "Queries unlock when the models finish.",
    testsTitle: "dbt tests",
    testsIntro: "Each test is the SQL dbt compiled. It passes when the query returns zero rows, the same rule as dbt test.",
    testFilterLabel: "Filter",
    testsWaiting: "Tests start when the models finish.",
    testsProgress: "Test {done} of {total}.",
    testsDone: "{passed} passed, {failed} failed, out of {total}. {ms} ms.",
    pass: "pass",
    fail: "fail",
    error: "error",
    showSql: "SQL",
    defsTitle: "Definitions",
    defsIntro: "The same rules as models/marts and the README. Column names stay as they are in the warehouse.",
    limitsTitle: "Limits",
    footerProject: "Mercado Alba is a fictitious retailer. Customers, stores, products, orders, and inventory come from scripts/generate_seeds.py with random.Random(42). Edgar Flores, Data/AI Engineer.",
    footerType: "Text is IBM Plex Sans and SQL is IBM Plex Mono, an open-source family made for technical reading. Green #0F6E56 is the only accent: the green of a produce-crate label, used for the run and for tests that pass.",
    rows: "rows",
    depends: "Depends on",
    queryNode: "Query this relation",
    rawSql: "Model SQL",
    compiledSql: "Compiled SQL",
    columns: "Columns",
    colName: "Column",
    colDescription: "Description",
    seedNote: "CSV seed. dbt loads it into raw before staging.",
    group_raw: "raw · seeds",
    group_staging: "staging",
    group_intermediate: "intermediate",
    group_core: "dimensions and facts",
    group_published: "marts",
    state_pending: "pending",
    state_running: "running",
    state_done: "ready",
    state_error: "error",
    mat_seed: "seed",
    mat_view: "view",
    mat_table: "table",
    presetSegment: "Customers by segment",
    presetStores: "Store scorecard",
    presetDaily: "Daily sales",
    presetProducts: "Products by GMV",
    presetStock: "Closing inventory",
    presetCancelled: "Cancelled orders",
  },
};

const DEFS = {
  es: [
    ["GMV", "Suma de line_amount_centavos en líneas con status completed y line_type sale. Las devoluciones no se restan. Las líneas canceladas siguen en el hecho y quedan fuera."],
    ["Ventas netas", "Suma de line_amount_centavos en líneas completed. La línea de devolución es negativa y baja la venta neta."],
    ["Margen bruto", "Suma de margin_centavos en líneas completed. El margen es la cantidad con signo por el precio unitario menos el costo unitario."],
    ["Pedido con venta", "Pedido completed cuyo gross_sales_centavos es mayor que cero."],
    ["Ticket promedio", "GMV en MXN dividido entre los pedidos con venta."],
    ["Tasa de devolución", "Valor absoluto del monto de devolución completed dividido entre el GMV."],
    ["Tasa de cancelación", "Pedidos cancelados divididos entre todos los pedidos."],
    ["Participación online del GMV", "Monto de venta completed con channel online, dividido entre el GMV. El canal pertenece a la tienda. Mercado Alba Digital es la única tienda online."],
    ["Participación online de pedidos", "Pedidos con channel online divididos entre todos los pedidos. Sale de mart_store_scorecard, no de una columna de la fila de KPIs."],
    ["Tasa de existencia", "Posiciones del último inventory_date con available_units mayor que cero, divididas entre las posiciones de ese día. Disponible es on_hand_units menos reserved_units."],
    ["Cliente activo", "Cliente con al menos una línea de venta completed."],
    ["Segmento", "Cuenta pedidos completed en la ventana. none es 0, one_time es 1, returning es de 2 a 4, frequent es 5 o más. Un pedido cancelado no cuenta."],
    ["Banda de precio", "value por debajo de 50.00 MXN, mid desde 50.00 hasta 150.00 MXN, premium por encima de 150.00 MXN."],
  ],
  en: [
    ["GMV", "Sum of line_amount_centavos on lines with status completed and line_type sale. Returns are not subtracted. Cancelled lines stay on the fact and are excluded."],
    ["Net sales", "Sum of line_amount_centavos on completed lines. A return line is negative, so it reduces net sales."],
    ["Gross margin", "Sum of margin_centavos on completed lines. Margin is signed quantity times unit price minus unit cost."],
    ["Completed sale order", "A completed order whose gross_sales_centavos is greater than zero."],
    ["AOV", "GMV in MXN divided by completed sale orders."],
    ["Return rate", "Absolute completed return amount divided by GMV."],
    ["Cancel rate", "Cancelled orders divided by all orders."],
    ["Online share of GMV", "Completed sale amount where channel is online, divided by GMV. Channel belongs to the store. Mercado Alba Digital is the only online store."],
    ["Online share of orders", "Orders whose channel is online, divided by all orders. It comes from mart_store_scorecard, not from a column on the KPI row."],
    ["In-stock rate", "Positions on the latest inventory_date with available_units above zero, divided by all positions that day. Available units are on_hand_units minus reserved_units."],
    ["Active customer", "A customer with at least one completed sale line."],
    ["Segment", "Counts completed orders in the window. none is 0, one_time is 1, returning is 2 to 4, frequent is 5 or more. A cancelled order does not count."],
    ["Price band", "value under 50.00 MXN, mid from 50.00 through 150.00 MXN, premium above 150.00 MXN."],
  ],
};

const LIMITS = {
  es: [
    "El navegador no llama al CLI de dbt. Corre el SELECT que dbt compile escribió para DuckDB.",
    "No crea los índices de los hechos ni la partición y el cluster de BigQuery. Esas opciones no cambian el SELECT.",
    "DuckDB-WASM se descarga de jsDelivr. Sin esa red la corrida no arranca.",
    "El inventario es el snapshot sintético. No es un libro reconstruido desde los pedidos, y lo reservado no se asigna a un pedido.",
    "Una devolución no apunta a la línea de venta original.",
    "La fecha civil resta 6 horas fijas. No se aplica el horario de verano.",
    "La vista de una consulta muestra como máximo 200 filas.",
  ],
  en: [
    "The browser does not call the dbt CLI. It runs the SELECT that dbt compile wrote for DuckDB.",
    "It does not create the fact indexes or the BigQuery partition and cluster. Those options do not change the SELECT.",
    "DuckDB-WASM is downloaded from jsDelivr. Without that network the run does not start.",
    "Inventory is the synthetic snapshot. It is not a ledger rebuilt from orders, and reserved units are not assigned to an order.",
    "A return does not point at the original sale line.",
    "The civil date subtracts a fixed 6 hours. Daylight saving is not applied.",
    "A query view shows at most 200 rows.",
  ],
};

const FLOW = {
  es: `flowchart TD
  seeds["Seeds<br/>customers, products, stores, mx_holidays,<br/>orders, order_lines, inventory_snapshots"]
  stg["Staging<br/>trim, cast, fecha civil"]
  mid["Intermediate<br/>líneas con signo, rol del pedido,<br/>historial del cliente, posición de inventario"]
  dims["Dimensiones<br/>dim_date, dim_customer,<br/>dim_product, dim_store"]
  facts["Hechos<br/>fct_order_lines, fct_orders,<br/>fct_inventory_daily"]
  marts["Marts<br/>venta diaria, scorecard de tienda,<br/>desempeño de producto, KPIs"]
  seeds --> stg --> mid
  mid --> dims
  mid --> facts
  dims --> facts
  facts --> marts
  dims --> marts`,
  en: `flowchart TD
  seeds["Seeds<br/>customers, products, stores, mx_holidays,<br/>orders, order_lines, inventory_snapshots"]
  stg["Staging<br/>trim, cast, civil order_date"]
  mid["Intermediate<br/>signed lines, order rollup,<br/>customer history, stock position"]
  dims["Dimensions<br/>dim_date, dim_customer,<br/>dim_product, dim_store"]
  facts["Facts<br/>fct_order_lines, fct_orders,<br/>fct_inventory_daily"]
  marts["Marts<br/>daily sales, store scorecard,<br/>product performance, business KPIs"]
  seeds --> stg --> mid
  mid --> dims
  mid --> facts
  dims --> facts
  facts --> marts
  dims --> marts`,
};

const ER = `erDiagram
  DIM_DATE ||--o{ FCT_ORDERS : order_date
  DIM_DATE ||--o{ FCT_ORDER_LINES : order_date
  DIM_DATE ||--o{ FCT_INVENTORY_DAILY : inventory_date
  DIM_CUSTOMER ||--o{ FCT_ORDER_LINES : customer_id
  DIM_STORE ||--o{ FCT_ORDER_LINES : store_id
  DIM_PRODUCT ||--o{ FCT_ORDER_LINES : product_id
  DIM_STORE ||--o{ FCT_INVENTORY_DAILY : store_id
  DIM_PRODUCT ||--o{ FCT_INVENTORY_DAILY : product_id
  FCT_ORDERS ||--o{ FCT_ORDER_LINES : order_id`;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  lang: "es",
  catalog: null,
  db: null,
  conn: null,
  duckdbVersion: "",
  rewriteSql: (sql) => sql,
  attached: false,
  running: false,
  ready: false,
  runId: 0,
  layers: {},
  counts: {},
  nodes: [],
  selected: null,
  kpi: null,
  stores: [],
  daily: [],
  products: [],
  category: "all",
  animateGmv: false,
  tests: null,
  testItems: [],
  testFilter: "",
  sqlDirty: false,
  mermaid: null,
  diagramToken: 0,
};

let gate = Promise.resolve();

function enqueue(task) {
  const next = gate.then(task, task);
  gate = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

function t(key) {
  return COPY[state.lang][key] ?? key;
}

function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function $(id) {
  return document.getElementById(id);
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function int(value) {
  return Math.round(num(value));
}

function roundHalfUp(value, digits) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const factor = 10 ** digits;
  const sign = number < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(number) * factor + 1e-8)) / factor;
}

function formatMxn(value) {
  const rounded = roundHalfUp(value, 2);
  if (rounded == null) return "";
  return rounded.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatInt(value) {
  return int(value).toLocaleString("en-US");
}

function formatPercentRatio(numerator, denominator) {
  if (!denominator) return "";
  const value = roundHalfUp((Number(numerator) * 100) / Number(denominator), 2);
  return `${value.toFixed(2)}%`;
}

function formatRate(value) {
  if (value == null || value === "") return "";
  const rounded = roundHalfUp(Number(value) * 100, 2);
  if (rounded == null) return "";
  return `${rounded.toFixed(2)}%`;
}

function truthy(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function normalize(value, field) {
  if (value == null) return null;
  const type = field?.type;
  const typeName = type?.toString?.() || "";
  if (typeof type?.scale === "number" && value && typeof value === "object") {
    return decimalToString(value, type.scale);
  }
  if (typeName.startsWith("Date") || typeName.startsWith("Timestamp")) {
    if (value instanceof Date) return formatDateValue(value);
    return formatTemporal(value, typeName);
  }
  if (typeof value === "bigint") {
    const asNumber = Number(value);
    return Number.isSafeInteger(asNumber) ? asNumber : value.toString();
  }
  if (value instanceof Date) return formatDateValue(value);
  if (typeof value === "object" && typeof value.toString === "function") {
    const text = value.toString();
    if (text && text !== "[object Object]") return text;
  }
  return value;
}

function decimalToString(value, scale) {
  const raw = value.toString();
  if (raw.includes(".") || !scale) return raw;
  const negative = raw.startsWith("-");
  const digits = negative ? raw.slice(1) : raw;
  const padded = digits.padStart(scale + 1, "0");
  const whole = padded.slice(0, padded.length - scale);
  const fraction = padded.slice(padded.length - scale);
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

function formatTemporal(value, typeName) {
  const number = typeof value === "bigint" ? Number(value) : Number(value);
  if (!Number.isFinite(number)) return String(value);
  const abs = Math.abs(number);
  let ms;
  if (typeName.includes("DAY") && abs < 1e7) ms = number * 86400000;
  else if (abs < 1e12) ms = number * 1000;
  else if (abs < 1e15) ms = number;
  else if (abs < 1e18) ms = number / 1000;
  else ms = number / 1e6;
  return formatDateValue(new Date(ms));
}

function formatDateValue(value) {
  const y = value.getUTCFullYear();
  const m = String(value.getUTCMonth() + 1).padStart(2, "0");
  const d = String(value.getUTCDate()).padStart(2, "0");
  const hh = value.getUTCHours();
  const mm = value.getUTCMinutes();
  const ss = value.getUTCSeconds();
  if (hh === 0 && mm === 0 && ss === 0) return `${y}-${m}-${d}`;
  return `${y}-${m}-${d} ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function tableToRows(table) {
  if (!table || !table.schema) return [];
  const fields = table.schema.fields;
  return table.toArray().map((row) => {
    const out = {};
    for (const field of fields) out[field.name] = normalize(row[field.name], field);
    return out;
  });
}

async function query(sql) {
  const table = await state.conn.query(state.rewriteSql(sql));
  return tableToRows(table);
}

async function exec(sql) {
  await state.conn.query(state.rewriteSql(sql));
}

function setStatus(text) {
  $("status").textContent = text;
}

function setRunButton() {
  const button = $("run");
  button.disabled = state.running || !state.catalog;
  button.textContent = state.running ? t("runBusy") : state.ready ? t("rerun") : t("run");
  $("sql-run").disabled = !state.ready || state.running;
  $("resultado").setAttribute("aria-busy", String(state.running));
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.title = t("title");
  document.querySelector(".skip").textContent = t("skip");
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const button of document.querySelectorAll("[data-set-lang]")) {
    button.setAttribute("aria-pressed", String(button.dataset.setLang === state.lang));
  }
  $("footer-project").textContent = t("footerProject");
  $("footer-type").textContent = t("footerType");
  $("lede").textContent = ledeText();
  $("window-note").textContent = windowNote();
  $("engine-note").textContent = engineNote();
  setRunButton();
  renderLayers();
  renderKpis();
  renderStores();
  renderDaily();
  renderCategoryFilter();
  renderProducts();
  paintNodeMeta();
  renderDetail();
  renderPresets();
  renderTests();
  renderDefs();
  renderLimits();
  paintDiagrams();
}

function ledeText() {
  if (!state.catalog) return t("ledeWaiting");
  return fill(t("lede"), {
    seeds: state.catalog.seeds.length,
    models: state.catalog.models.length,
    tests: state.catalog.tests.length,
    dbt: state.catalog.dbtVersion,
  });
}

function windowNote() {
  if (!state.catalog) return "";
  return fill(t("windowNote"), {
    start: state.catalog.vars.calendar_start,
    end: state.catalog.vars.as_of_date,
  });
}

function engineNote() {
  if (!state.catalog) return "";
  const duck = state.duckdbVersion ? `DuckDB-WASM ${state.duckdbVersion}. ` : "";
  return `${duck}dbt ${state.catalog.dbtVersion} (${state.catalog.adapter}). @duckdb/duckdb-wasm 1.33.1-dev65.0.`;
}

function renderLayers() {
  const list = $("layers");
  list.replaceChildren();
  for (const group of GROUPS) {
    const li = document.createElement("li");
    const status = state.layers[group] || "pending";
    li.dataset.state = status;
    const name = document.createElement("span");
    name.textContent = t(`group_${group}`);
    const mark = document.createElement("span");
    mark.textContent = t(`state_${status}`);
    li.append(name, mark);
    list.append(li);
  }
}

function renderKpis() {
  const body = $("kpi-table").querySelector("tbody");
  $("kpi-caption").textContent = t("kpiCaption");
  body.replaceChildren();
  if (!state.kpi) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 2;
    cell.textContent = t("kpiEmpty");
    row.append(cell);
    body.append(row);
    return;
  }
  const kpi = state.kpi;
  const onlineOrders = state.stores
    .filter((row) => row.channel === "online")
    .reduce((sum, row) => sum + int(row.orders), 0);
  const lines = [
    {
      label: t("kpiWindow"),
      value: state.lang === "en"
        ? `${kpi.window_start} to ${kpi.window_end}`
        : `${kpi.window_start} a ${kpi.window_end}`,
    },
    { label: t("kpiGmv"), value: `${formatMxn(kpi.gmv_mxn)} MXN`, note: t("noteGmv"), animate: num(kpi.gmv_mxn) },
    { label: t("kpiNet"), value: `${formatMxn(kpi.net_sales_mxn)} MXN` },
    { label: t("kpiMargin"), value: `${formatMxn(kpi.margin_mxn)} MXN` },
    { label: t("kpiMarginRatio"), value: formatPercentRatio(kpi.margin_centavos, kpi.gmv_centavos) },
    { label: t("kpiOrders"), value: formatInt(kpi.orders) },
    { label: t("kpiCompleted"), value: formatInt(kpi.completed_orders) },
    { label: t("kpiSaleOrders"), value: formatInt(kpi.completed_sale_orders) },
    { label: t("kpiCancelled"), value: formatInt(kpi.cancelled_orders) },
    { label: t("kpiAov"), value: `${formatMxn(num(kpi.gmv_centavos) / 100 / num(kpi.completed_sale_orders))} MXN`, note: t("noteAov") },
    { label: t("kpiUnits"), value: formatInt(kpi.units_sold) },
    { label: t("kpiLines"), value: formatInt(kpi.order_lines) },
    {
      label: t("kpiReturn"),
      value: formatPercentRatio(Math.abs(num(kpi.return_amount_centavos)), kpi.gmv_centavos),
      note: fill(t("noteReturn"), {
        returns: formatInt(Math.abs(num(kpi.return_amount_centavos))),
        gmv: formatInt(kpi.gmv_centavos),
      }),
    },
    {
      label: t("kpiCancel"),
      value: formatPercentRatio(kpi.cancelled_orders, kpi.orders),
      note: fill(t("noteCancel"), {
        cancelled: formatInt(kpi.cancelled_orders),
        orders: formatInt(kpi.orders),
      }),
    },
    {
      label: t("kpiOnlineGmv"),
      value: formatPercentRatio(kpi.online_gmv_centavos, kpi.gmv_centavos),
      note: fill(t("noteOnline"), {
        online: formatInt(kpi.online_gmv_centavos),
        gmv: formatInt(kpi.gmv_centavos),
      }),
    },
    {
      label: t("kpiOnlineOrders"),
      value: formatPercentRatio(onlineOrders, kpi.orders),
      note: fill(t("noteOnlineOrders"), {
        online: formatInt(onlineOrders),
        orders: formatInt(kpi.orders),
      }),
    },
    {
      label: t("kpiStock"),
      value: formatPercentRatio(kpi.in_stock_positions, kpi.inventory_positions),
      note: fill(t("noteStock"), {
        stock: formatInt(kpi.in_stock_positions),
        positions: formatInt(kpi.inventory_positions),
        date: kpi.inventory_as_of,
      }),
    },
    { label: t("kpiCustomers"), value: formatInt(kpi.customers) },
    { label: t("kpiNone"), value: formatInt(kpi.customers_none) },
    { label: t("kpiOne"), value: formatInt(kpi.customers_one_time) },
    { label: t("kpiReturning"), value: formatInt(kpi.customers_returning) },
    { label: t("kpiFrequent"), value: formatInt(kpi.customers_frequent) },
    {
      label: t("kpiActive"),
      value: formatInt(kpi.active_customers),
      note: fill(t("noteActive"), {
        active: formatInt(kpi.active_customers),
        customers: formatInt(kpi.customers),
      }),
    },
  ];
  for (const line of lines) {
    const row = document.createElement("tr");
    const label = document.createElement("th");
    label.scope = "row";
    label.textContent = line.label;
    const value = document.createElement("td");
    value.className = "num";
    const main = document.createElement("span");
    main.textContent = line.value;
    value.append(main);
    if (line.note) {
      const note = document.createElement("small");
      note.textContent = line.note;
      value.append(note);
    }
    row.append(label, value);
    body.append(row);
    if (line.animate != null && state.animateGmv) animateMxn(main, line.animate, line.value);
  }
  state.animateGmv = false;
}

function animateMxn(el, target, finalText) {
  if (reduceMotion) {
    el.textContent = finalText;
    return;
  }
  const start = performance.now();
  const duration = 450;
  function frame(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    el.textContent = `${formatMxn(target * eased)} MXN`;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = finalText;
  }
  requestAnimationFrame(frame);
}

function renderStores() {
  const host = $("store-table");
  if (!state.stores.length) {
    host.replaceChildren(note(t("storesWaiting")));
    $("stores-note").textContent = "";
    return;
  }
  const storeOrders = state.stores.reduce((sum, row) => sum + int(row.orders), 0);
  const storeGmv = state.stores.reduce((sum, row) => sum + int(row.gmv_centavos), 0);
  $("stores-note").textContent = state.kpi
    ? fill(t("storesReconcile"), {
        orders: formatInt(storeOrders),
        gmv: formatInt(storeGmv),
        kOrders: formatInt(state.kpi.orders),
        kGmv: formatInt(state.kpi.gmv_centavos),
      })
    : "";
  const max = Math.max(...state.stores.map((row) => num(row.gmv_centavos)), 1);
  renderTable(host, t("storesCaption"), [
    { label: t("colStore"), value: (row) => row.store_name },
    { label: t("colChannel"), value: (row) => row.channel },
    { label: t("colRegion"), value: (row) => row.region },
    { label: t("colOrders"), numeric: true, value: (row) => formatInt(row.orders) },
    { label: t("colGmv"), numeric: true, value: (row) => formatMxn(row.gmv_mxn) },
    { label: t("colBar"), bar: (row) => (num(row.gmv_centavos) / max) * 100 },
    { label: t("colNet"), numeric: true, value: (row) => formatMxn(row.net_sales_mxn) },
    { label: t("colAov"), numeric: true, value: (row) => formatMxn(row.aov_mxn) },
    { label: t("colReturn"), numeric: true, value: (row) => formatRate(row.return_rate) },
    { label: t("colCancel"), numeric: true, value: (row) => formatRate(row.cancel_rate) },
    { label: t("colStock"), numeric: true, value: (row) => formatRate(row.in_stock_rate) },
  ], state.stores);
}

function renderDaily() {
  const figure = $("daily-chart");
  const tableHost = $("daily-table");
  figure.replaceChildren();
  if (!state.daily.length) {
    tableHost.replaceChildren();
    return;
  }
  const svg = document.createElementNS(SVG_NS, "svg");
  const width = 900;
  const height = 220;
  const padL = 8;
  const padR = 8;
  const padT = 8;
  const padB = 28;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const values = state.daily.map((row) => num(row.gmv_mxn));
  const max = Math.max(...values, 1);
  const barW = innerW / state.daily.length;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", t("dailyChartLabel"));
  let lastMonth = "";
  state.daily.forEach((row, index) => {
    const value = num(row.gmv_mxn);
    const barH = (value / max) * innerH;
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", String(padL + index * barW + 0.4));
    rect.setAttribute("y", String(padT + innerH - barH));
    rect.setAttribute("width", String(Math.max(barW - 0.8, 0.4)));
    rect.setAttribute("height", String(Math.max(barH, 0)));
    rect.setAttribute("fill", "#0f6e56");
    const title = document.createElementNS(SVG_NS, "title");
    title.textContent = `${row.order_date}: ${formatMxn(value)} MXN`;
    rect.append(title);
    svg.append(rect);
    const month = String(row.order_date).slice(0, 7);
    if (month !== lastMonth) {
      lastMonth = month;
      const text = document.createElementNS(SVG_NS, "text");
      text.setAttribute("x", String(padL + index * barW));
      text.setAttribute("y", String(height - 8));
      text.textContent = month;
      svg.append(text);
    }
  });
  const caption = document.createElement("figcaption");
  caption.textContent = dailyCaption(state.daily);
  figure.append(svg, caption);
  renderTable(tableHost, "marts.mart_daily_sales", [
    { label: t("colDate"), value: (row) => row.order_date },
    { label: t("colOrders"), numeric: true, value: (row) => formatInt(row.orders) },
    { label: t("colGmv"), numeric: true, value: (row) => formatMxn(row.gmv_mxn) },
    { label: t("colNet"), numeric: true, value: (row) => formatMxn(row.net_sales_mxn) },
    { label: t("colUnits"), numeric: true, value: (row) => formatInt(row.units_sold) },
  ], state.daily);
}

function dailyCaption(rows) {
  const rest = rows.filter((row) => truthy(row.is_weekend) || truthy(row.is_mx_public_holiday));
  const week = rows.filter((row) => !truthy(row.is_weekend) && !truthy(row.is_mx_public_holiday));
  const holidays = rows
    .filter((row) => truthy(row.is_mx_public_holiday))
    .map((row) => `${row.order_date} ${row.holiday_name}`)
    .join(", ");
  const mean = (subset) => (subset.length ? subset.reduce((sum, row) => sum + num(row.gmv_mxn), 0) / subset.length : 0);
  return fill(t("dailyCaption"), {
    week: formatMxn(mean(week)),
    weekDays: formatInt(week.length),
    rest: formatMxn(mean(rest)),
    restDays: formatInt(rest.length),
    holidays: holidays || (state.lang === "en" ? "none" : "ninguno"),
  });
}

function renderCategoryFilter() {
  const select = $("category");
  const current = state.category || "all";
  const categories = [...new Set(state.products.map((row) => String(row.category)))].sort();
  select.replaceChildren();
  const all = document.createElement("option");
  all.value = "all";
  all.textContent = t("allCategories");
  select.append(all);
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.append(option);
  }
  select.value = current === "all" || categories.includes(current) ? current : "all";
  state.category = select.value;
}

function renderProducts() {
  const host = $("product-table");
  if (!state.products.length) {
    host.replaceChildren();
    return;
  }
  const rows = state.category === "all"
    ? state.products
    : state.products.filter((row) => String(row.category) === state.category);
  renderTable(host, t("productsCaption"), [
    { label: t("colSku"), value: (row) => row.sku },
    { label: t("colProduct"), value: (row) => row.product_name },
    { label: t("colCategory"), value: (row) => row.category },
    { label: t("colBand"), value: (row) => row.price_band },
    { label: t("colUnits"), numeric: true, value: (row) => formatInt(row.units_sold) },
    { label: t("colReturned"), numeric: true, value: (row) => formatInt(row.units_returned) },
    { label: t("colGmv"), numeric: true, value: (row) => formatMxn(row.gmv_mxn) },
    { label: t("colMargin"), numeric: true, value: (row) => formatMxn(row.margin_mxn) },
    { label: t("colMarginRate"), numeric: true, value: (row) => (row.margin_rate == null ? "" : formatRate(row.margin_rate)) },
    { label: t("colStockouts"), numeric: true, value: (row) => formatInt(row.stockout_positions) },
  ], rows);
}

function renderTable(host, caption, headers, rows) {
  const table = document.createElement("table");
  const cap = document.createElement("caption");
  cap.textContent = caption;
  table.append(cap);
  const thead = document.createElement("thead");
  const head = document.createElement("tr");
  for (const header of headers) {
    const th = document.createElement("th");
    th.textContent = header.label;
    if (header.numeric || header.bar) th.className = "num";
    head.append(th);
  }
  thead.append(head);
  const body = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const header of headers) {
      const td = document.createElement("td");
      if (header.bar) {
        td.className = "bar-cell";
        const span = document.createElement("span");
        span.className = "bar";
        span.style.width = `${Math.max(0, Math.min(100, header.bar(row)))}%`;
        td.append(span);
      } else {
        if (header.numeric) td.className = "num";
        td.textContent = header.value(row) ?? "";
      }
      tr.append(td);
    }
    body.append(tr);
  }
  table.append(thead, body);
  host.replaceChildren(table);
}

function note(text) {
  const p = document.createElement("p");
  p.className = "note";
  p.textContent = text;
  return p;
}

function nodeMeta(node) {
  const kind = t(`mat_${node.materialized}`);
  const count = state.counts[node.id];
  if (count == null) return kind;
  return `${kind}, ${formatInt(count)} ${t("rows")}`;
}

function renderLineage() {
  const board = $("lineage-board");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.id = "lineage-svg";
  const cols = document.createElement("div");
  cols.className = "lineage-cols";
  for (const group of GROUPS) {
    const col = document.createElement("div");
    col.className = "lineage-col";
    const heading = document.createElement("h3");
    heading.textContent = t(`group_${group}`);
    col.append(heading);
    for (const node of state.nodes.filter((item) => item.group === group)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "node";
      button.dataset.id = node.id;
      button.setAttribute("aria-pressed", "false");
      const name = document.createElement("span");
      name.className = "node-name";
      name.textContent = node.name;
      const meta = document.createElement("span");
      meta.className = "node-meta";
      meta.textContent = nodeMeta(node);
      button.append(name, meta);
      button.addEventListener("click", () => {
        state.selected = node.id;
        paintSelection();
        renderDetail();
      });
      col.append(button);
    }
    cols.append(col);
  }
  board.replaceChildren(svg, cols);
  requestAnimationFrame(drawEdges);
}

function paintNodeMeta() {
  for (const button of document.querySelectorAll(".node")) {
    const node = state.nodes.find((item) => item.id === button.dataset.id);
    if (!node) continue;
    const meta = button.querySelector(".node-meta");
    if (meta) meta.textContent = nodeMeta(node);
  }
  const headings = document.querySelectorAll(".lineage-col h3");
  GROUPS.forEach((group, index) => {
    if (headings[index]) headings[index].textContent = t(`group_${group}`);
  });
}

function connected(id) {
  const incoming = new Map();
  const outgoing = new Map();
  for (const edge of state.catalog.edges) {
    if (!incoming.has(edge.to)) incoming.set(edge.to, []);
    incoming.get(edge.to).push(edge.from);
    if (!outgoing.has(edge.from)) outgoing.set(edge.from, []);
    outgoing.get(edge.from).push(edge.to);
  }
  const set = new Set([id]);
  const walk = (graph) => {
    const stack = [id];
    const seen = new Set([id]);
    while (stack.length) {
      const current = stack.pop();
      for (const next of graph.get(current) || []) {
        if (seen.has(next)) continue;
        seen.add(next);
        set.add(next);
        stack.push(next);
      }
    }
  };
  walk(incoming);
  walk(outgoing);
  return set;
}

function paintSelection() {
  const set = state.selected ? connected(state.selected) : null;
  for (const button of document.querySelectorAll(".node")) {
    const on = button.dataset.id === state.selected;
    button.setAttribute("aria-pressed", String(on));
    button.classList.toggle("is-dim", Boolean(set) && !set.has(button.dataset.id));
  }
  drawEdges();
}

function drawEdges() {
  const board = $("lineage-board");
  const svg = $("lineage-svg");
  if (!board || !svg) return;
  const width = board.scrollWidth;
  const height = board.scrollHeight;
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.replaceChildren();
  const origin = board.getBoundingClientRect();
  const points = {};
  for (const button of board.querySelectorAll(".node")) {
    const rect = button.getBoundingClientRect();
    points[button.dataset.id] = {
      x1: rect.left - origin.left,
      x2: rect.right - origin.left,
      y: rect.top - origin.top + rect.height / 2,
    };
  }
  const set = state.selected ? connected(state.selected) : null;
  for (const edge of state.catalog.edges) {
    const source = points[edge.from];
    const target = points[edge.to];
    if (!source || !target) continue;
    const path = document.createElementNS(SVG_NS, "path");
    const mid = (source.x2 + target.x1) / 2;
    path.setAttribute(
      "d",
      `M ${source.x2} ${source.y} C ${mid} ${source.y}, ${mid} ${target.y}, ${target.x1} ${target.y}`,
    );
    path.setAttribute("fill", "none");
    const hot = set && set.has(edge.from) && set.has(edge.to);
    path.setAttribute("stroke", hot ? "#0f6e56" : "#8b968f");
    path.setAttribute("stroke-width", hot ? "1.6" : "1");
    svg.append(path);
  }
}

function renderDetail() {
  const host = $("node-detail");
  const node = state.nodes.find((item) => item.id === state.selected);
  if (!node) {
    host.replaceChildren();
    return;
  }
  host.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = node.id;
  host.append(heading);
  const description = document.createElement("p");
  description.textContent = node.description || (node.materialized === "seed" ? t("seedNote") : "");
  host.append(description);
  const meta = document.createElement("p");
  meta.className = "note";
  const link = document.createElement("a");
  link.href = REPO + node.path;
  link.textContent = node.path;
  meta.append(link, document.createTextNode(`. ${nodeMeta(node)}`));
  host.append(meta);
  if (node.dependsOn && node.dependsOn.length) {
    const depends = document.createElement("p");
    depends.textContent = `${t("depends")}: ${node.dependsOn.join(", ")}`;
    host.append(depends);
  }
  if (node.columns && node.columns.length) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = t("columns");
    details.append(summary);
    const wrap = document.createElement("div");
    wrap.className = "scroll";
    renderTable(wrap, node.id, [
      { label: t("colName"), value: (row) => row.name },
      { label: t("colDescription"), value: (row) => row.description || "" },
    ], node.columns);
    details.append(wrap);
    host.append(details);
  }
  if (node.rawSql || node.sql) {
    const tabs = document.createElement("div");
    tabs.className = "tabs";
    tabs.setAttribute("role", "tablist");
    const pre = document.createElement("pre");
    pre.className = "sql";
    const show = (which) => {
      pre.textContent = which === "raw" ? node.rawSql : node.sql;
      for (const button of tabs.querySelectorAll("button")) {
        button.setAttribute("aria-selected", String(button.dataset.sql === which));
      }
    };
    if (node.rawSql) tabs.append(sqlTab("raw", t("rawSql"), show));
    if (node.sql) tabs.append(sqlTab("compiled", t("compiledSql"), show));
    host.append(tabs, pre);
    show(node.rawSql ? "raw" : "compiled");
  }
  const queryButton = document.createElement("button");
  queryButton.type = "button";
  queryButton.textContent = t("queryNode");
  queryButton.addEventListener("click", () => {
    $("sql-input").value = `select *\nfrom ${node.id}\nlimit 50`;
    state.sqlDirty = true;
    $("sql").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    if (state.ready) runUserSql();
  });
  host.append(queryButton);
}

function sqlTab(id, label, show) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.sql = id;
  button.textContent = label;
  button.setAttribute("role", "tab");
  button.addEventListener("click", () => show(id));
  return button;
}

function presetList() {
  const asOf = state.catalog.vars.as_of_date;
  return [
    {
      id: "segment",
      label: t("presetSegment"),
      sql: "select\n    customer_segment,\n    count(*) as customers,\n    sum(gmv_centavos) as gmv_centavos\nfrom marts.dim_customer\ngroup by customer_segment\norder by customers desc",
    },
    {
      id: "stores",
      label: t("presetStores"),
      sql: "select\n    store_name,\n    channel,\n    region,\n    orders,\n    gmv_mxn,\n    net_sales_mxn,\n    aov_mxn,\n    return_rate,\n    in_stock_rate\nfrom marts.mart_store_scorecard\norder by gmv_centavos desc, store_id",
    },
    {
      id: "daily",
      label: t("presetDaily"),
      sql: "select\n    order_date,\n    orders,\n    gmv_mxn,\n    net_sales_mxn,\n    units_sold\nfrom marts.mart_daily_sales\norder by order_date",
    },
    {
      id: "products",
      label: t("presetProducts"),
      sql: "select\n    sku,\n    product_name,\n    category,\n    gmv_mxn,\n    margin_mxn,\n    units_sold\nfrom marts.mart_product_performance\norder by gmv_centavos desc",
    },
    {
      id: "stock",
      label: t("presetStock"),
      sql: `select\n    inventory_date,\n    store_id,\n    product_id,\n    on_hand_units,\n    reserved_units,\n    available_units,\n    is_stockout\nfrom marts.fct_inventory_daily\nwhere inventory_date = date '${asOf}'\nlimit 50`,
    },
    {
      id: "cancelled",
      label: t("presetCancelled"),
      sql: "select\n    order_id,\n    customer_id,\n    store_id,\n    order_date,\n    gross_sales_mxn\nfrom marts.fct_orders\nwhere status = 'cancelled'\norder by order_date, order_id\nlimit 50",
    },
  ];
}

function renderPresets() {
  if (!state.catalog) return;
  const select = $("preset");
  const current = select.value;
  select.replaceChildren();
  for (const preset of presetList()) {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = preset.label;
    select.append(option);
  }
  if ([...select.options].some((option) => option.value === current)) select.value = current;
  const relation = $("relation");
  const chosen = relation.value;
  relation.replaceChildren();
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = t("relationPlaceholder");
  relation.append(empty);
  for (const node of state.nodes) {
    const option = document.createElement("option");
    option.value = node.id;
    option.textContent = node.id;
    relation.append(option);
  }
  if ([...relation.options].some((option) => option.value === chosen)) relation.value = chosen;
}

function renderTests() {
  const summary = $("test-summary");
  if (!state.tests && !state.testItems.length) {
    summary.textContent = state.testProgress || t("testsWaiting");
    $("test-groups").replaceChildren();
    return;
  }
  if (state.tests) {
    summary.textContent = fill(t("testsDone"), state.tests);
  } else {
    summary.textContent = state.testProgress || t("testsWaiting");
  }
  const filter = state.testFilter.trim().toLowerCase();
  const items = state.testItems.filter((item) => !filter || item.label.toLowerCase().includes(filter) || (item.model || "").includes(filter));
  const groups = new Map();
  for (const item of items) {
    const key = item.model || "singular";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const keys = [...groups.keys()].sort((a, b) => {
    if (a === "singular") return -1;
    if (b === "singular") return 1;
    return a.localeCompare(b);
  });
  const root = $("test-groups");
  root.replaceChildren();
  for (const key of keys) {
    const groupItems = groups.get(key);
    const failed = groupItems.filter((item) => !item.ok).length;
    const details = document.createElement("details");
    details.open = key === "singular" || failed > 0 || Boolean(filter);
    const summaryEl = document.createElement("summary");
    const passed = groupItems.length - failed;
    summaryEl.textContent = `${key}: ${passed}/${groupItems.length}`;
    details.append(summaryEl);
    const list = document.createElement("ul");
    list.className = "test-list";
    for (const item of groupItems) {
      const li = document.createElement("li");
      const line = document.createElement("div");
      line.className = "test-line";
      const mark = document.createElement("span");
      mark.className = item.ok ? "pass" : "fail";
      mark.textContent = item.ok ? t("pass") : item.error ? t("error") : t("fail");
      const label = document.createElement("span");
      label.textContent = item.label;
      const sqlButton = document.createElement("button");
      sqlButton.type = "button";
      sqlButton.textContent = t("showSql");
      sqlButton.addEventListener("click", () => {
        const existing = li.querySelector("pre");
        if (existing) {
          existing.remove();
          return;
        }
        const pre = document.createElement("pre");
        pre.className = "sql";
        pre.textContent = item.error ? `${item.error}\n\n${item.sql}` : item.sql;
        li.append(pre);
      });
      line.append(mark, label, sqlButton);
      li.append(line);
      list.append(li);
    }
    details.append(list);
    root.append(details);
  }
}

function renderDefs() {
  renderTable($("defs"), "models/marts", [
    { label: t("metric"), value: (row) => row[0] },
    { label: t("colDescription"), value: (row) => row[1] },
  ], DEFS[state.lang]);
}

function renderLimits() {
  const list = $("limits");
  list.replaceChildren();
  for (const item of LIMITS[state.lang]) {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  }
}

async function paintDiagrams() {
  if (!state.mermaid) return;
  const token = ++state.diagramToken;
  try {
    const flow = await state.mermaid.render(`flow-${token}`, FLOW[state.lang]);
    if (token !== state.diagramToken) return;
    $("diagram-flow").innerHTML = flow.svg;
    const er = await state.mermaid.render(`er-${token}`, ER);
    if (token !== state.diagramToken) return;
    $("diagram-er").innerHTML = er.svg;
  } catch (error) {
    const pre = document.createElement("pre");
    pre.className = "sql";
    pre.textContent = `${FLOW[state.lang]}\n\n${error.message || error}`;
    $("diagram-flow").replaceChildren(pre);
  }
}

async function renderDiagrams() {
  try {
    const module = await import(MERMAID_URL);
    const mermaid = module.default;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      fontFamily: "IBM Plex Sans",
      themeVariables: {
        primaryColor: "#e4ebe7",
        primaryTextColor: "#1a211c",
        primaryBorderColor: "#0f6e56",
        lineColor: "#1a211c",
        secondaryColor: "#ffffff",
        tertiaryColor: "#f3f5f4",
        fontFamily: "IBM Plex Sans",
      },
    });
    state.mermaid = mermaid;
    await paintDiagrams();
  } catch (error) {
    const pre = document.createElement("pre");
    pre.className = "sql";
    pre.textContent = FLOW[state.lang];
    $("diagram-flow").replaceChildren(pre);
    console.error(error);
  }
}

async function openDatabase() {
  if (state.conn) return;
  setStatus(t("opening"));
  const duckdb = await import(DUCKDB_URL);
  const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
  const worker = await duckdb.createWorker(bundle.mainWorker);
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  await db.open({ path: ":memory:" });
  state.db = db;
  state.conn = await db.connect();
  state.duckdbVersion = await db.getVersion();
  for (const seed of state.catalog.seeds) {
    const response = await fetch(new URL(seed.path, import.meta.url));
    if (!response.ok) throw new Error(`${seed.path} HTTP ${response.status}`);
    await db.registerFileText(`${seed.name}.csv`, await response.text());
  }
  try {
    await state.conn.query("attach ':memory:' as mercadoalba");
    await state.conn.query("use mercadoalba");
    state.attached = true;
  } catch (error) {
    state.rewriteSql = (sql) => sql.replaceAll('"mercadoalba".', "");
    console.warn(error);
  }
  $("engine-note").textContent = engineNote();
}

async function resetSchemas() {
  await exec("drop schema if exists marts cascade");
  await exec("drop schema if exists intermediate cascade");
  await exec("drop schema if exists staging cascade");
  await exec("drop schema if exists raw cascade");
  for (const schema of ["raw", "staging", "intermediate", "marts"]) {
    await exec(`create schema ${schema}`);
  }
}

async function countRelation(id) {
  const rows = await query(`select count(*) as n from ${id}`);
  return int(rows[0].n);
}

function current(runId) {
  return runId === state.runId;
}

async function startRun() {
  if (state.running || !state.catalog) return;
  const runId = ++state.runId;
  state.running = true;
  state.ready = false;
  state.kpi = null;
  state.stores = [];
  state.daily = [];
  state.products = [];
  state.tests = null;
  state.testItems = [];
  state.testProgress = "";
  state.counts = {};
  state.layers = Object.fromEntries(GROUPS.map((group) => [group, "pending"]));
  state.animateGmv = false;
  setRunButton();
  renderLayers();
  renderKpis();
  renderStores();
  renderDaily();
  renderProducts();
  renderTests();
  $("run-log").textContent = "";
  try {
    await openDatabase();
    if (!current(runId)) return;
    await enqueue(async () => {
      if (!current(runId)) return;
      await resetSchemas();
    });
    let activeGroup = "";
    const relations = [
      ...state.catalog.seeds.map((seed) => ({ ...seed, kind: "seed" })),
      ...state.catalog.models.map((model) => ({ ...model, kind: "model" })),
    ];
    for (const relation of relations) {
      if (!current(runId)) return;
      if (relation.group !== activeGroup) {
        if (activeGroup) state.layers[activeGroup] = "done";
        activeGroup = relation.group;
        state.layers[activeGroup] = "running";
        renderLayers();
        paintNodeMeta();
        drawEdges();
      }
      setStatus(relation.kind === "seed"
        ? fill(t("loadingSeed"), { name: relation.name })
        : fill(t("building"), { id: relation.id }));
      await enqueue(async () => {
        if (!current(runId)) return;
        if (relation.kind === "seed") {
          const columns = Object.entries(relation.columns)
            .map(([name, type]) => `'${name}': '${type}'`)
            .join(", ");
          await exec(
            `create table ${relation.schema}.${relation.name} as select * from read_csv('${relation.name}.csv', header = true, columns = {${columns}})`,
          );
        } else {
          const keyword = relation.materialized === "table" ? "table" : "view";
          await exec(`create ${keyword} ${relation.schema}.${relation.name} as\n${relation.sql}`);
        }
        state.counts[relation.id] = await countRelation(relation.id);
      });
      if (!current(runId)) return;
      $("run-log").textContent = `${relation.id}: ${formatInt(state.counts[relation.id])} ${t("rows")}`;
      paintNodeMeta();
    }
    if (activeGroup) state.layers[activeGroup] = "done";
    renderLayers();
    drawEdges();
    await loadSheets(runId);
    if (!current(runId)) return;
    state.ready = true;
    state.running = false;
    state.animateGmv = true;
    setRunButton();
    setStatus(fill(t("modelsReady"), { models: state.catalog.models.length }));
    renderKpis();
    renderStores();
    renderDaily();
    renderCategoryFilter();
    renderProducts();
    paintNodeMeta();
    renderDetail();
    if (!$("sql-input").value.trim()) {
      applyPreset("segment", false);
    }
    await runUserSql();
    await runTests(runId);
  } catch (error) {
    if (!current(runId)) return;
    const message = error && error.message ? error.message : String(error);
    setStatus(`${t("failed")} ${message}`);
    $("run-log").textContent = message;
    const running = Object.entries(state.layers).find(([, status]) => status === "running");
    if (running) state.layers[running[0]] = "error";
    renderLayers();
  } finally {
    if (current(runId)) {
      state.running = false;
      setRunButton();
    }
  }
}

async function loadSheets(runId) {
  await enqueue(async () => {
    if (!current(runId)) return;
    const kpis = await query("select * from marts.mart_business_kpis");
    state.kpi = kpis[0] || null;
    state.stores = await query(
      "select * from marts.mart_store_scorecard order by gmv_centavos desc, store_id",
    );
    state.daily = await query(`
      select
        sales.order_date,
        sales.orders,
        sales.gmv_mxn,
        sales.net_sales_mxn,
        sales.units_sold,
        days.is_weekend,
        days.is_mx_public_holiday,
        days.holiday_name
      from marts.mart_daily_sales as sales
      inner join marts.dim_date as days
        on sales.order_date = days.date_day
      order by sales.order_date
    `);
    state.products = await query(
      "select * from marts.mart_product_performance order by gmv_centavos desc, product_id",
    );
  });
}

async function runTests(runId) {
  const started = performance.now();
  const items = [];
  const tests = state.catalog.tests;
  for (let index = 0; index < tests.length; index += 1) {
    if (!current(runId)) return;
    const test = tests[index];
    state.testProgress = fill(t("testsProgress"), { done: index + 1, total: tests.length });
    $("test-summary").textContent = state.testProgress;
    let item;
    try {
      const rows = await enqueue(async () => {
        if (!current(runId)) return null;
        return query(test.sql);
      });
      if (!current(runId) || rows == null) return;
      item = {
        ...test,
        ok: rows.length === 0,
        error: "",
      };
    } catch (error) {
      item = {
        ...test,
        ok: false,
        error: error && error.message ? error.message : String(error),
      };
    }
    items.push(item);
  }
  if (!current(runId)) return;
  const failed = items.filter((item) => !item.ok).length;
  state.testItems = items;
  state.tests = {
    passed: formatInt(items.length - failed),
    failed: formatInt(failed),
    total: formatInt(items.length),
    ms: formatInt(performance.now() - started),
  };
  state.testProgress = "";
  setStatus(t("ready"));
  renderTests();
}

async function executeStatement(sql) {
  const stripped = sql.trim().replace(/;+\s*$/, "");
  const head = stripped.slice(0, 24).toLowerCase();
  if (/^(select|with|from)\b/.test(head)) {
    try {
      const rows = await query(`select * from (\n${stripped}\n) as browser_query limit 201`);
      return { rows: rows.slice(0, 200), truncated: rows.length > 200, statement: false };
    } catch {
      const rows = await query(stripped);
      return { rows: rows.slice(0, 200), truncated: rows.length > 200, statement: false };
    }
  }
  if (head.startsWith("explain")) {
    const rows = await query(stripped);
    return { rows: rows.slice(0, 200), truncated: rows.length > 200, statement: false };
  }
  await exec(stripped);
  return { rows: [], truncated: false, statement: true };
}

async function runUserSql() {
  if (!state.ready) return;
  const sql = $("sql-input").value.trim();
  const status = $("sql-status");
  if (!sql) {
    status.textContent = "";
    $("sql-result").replaceChildren();
    return;
  }
  status.textContent = t("sqlRunning");
  const started = performance.now();
  try {
    const result = await enqueue(() => executeStatement(sql));
    const ms = formatInt(performance.now() - started);
    if (result.statement) {
      status.textContent = fill(t("sqlStatement"), { ms });
      $("sql-result").replaceChildren();
      return;
    }
    status.textContent = result.truncated
      ? fill(t("sqlTruncated"), { ms })
      : fill(t("sqlRows"), { shown: formatInt(result.rows.length), ms });
    renderSqlRows(result.rows);
  } catch (error) {
    status.textContent = error && error.message ? error.message : String(error);
    $("sql-result").replaceChildren();
  }
}

function renderSqlRows(rows) {
  const host = $("sql-result");
  if (!rows.length) {
    host.replaceChildren(note(state.lang === "en" ? "0 rows." : "0 filas."));
    return;
  }
  const keys = Object.keys(rows[0]);
  renderTable(host, "", keys.map((key) => ({
    label: key,
    numeric: rows.every((row) => row[key] == null || typeof row[key] === "number"),
    value: (row) => (row[key] == null ? "" : String(row[key])),
  })), rows);
}

function applyPreset(id, run = true) {
  const preset = presetList().find((item) => item.id === id);
  if (!preset) return;
  $("preset").value = id;
  $("sql-input").value = preset.sql;
  state.sqlDirty = false;
  if (run && state.ready) runUserSql();
}

function bind() {
  $("run").addEventListener("click", () => startRun());
  for (const button of document.querySelectorAll("[data-set-lang]")) {
    button.addEventListener("click", () => {
      state.lang = button.dataset.setLang;
      localStorage.setItem("mercadoalba-lang", state.lang);
      applyLanguage();
    });
  }
  $("category").addEventListener("change", () => {
    state.category = $("category").value;
    renderProducts();
  });
  $("preset").addEventListener("change", () => applyPreset($("preset").value));
  $("relation").addEventListener("change", () => {
    const id = $("relation").value;
    if (!id) return;
    $("sql-input").value = `select *\nfrom ${id}\nlimit 50`;
    state.sqlDirty = true;
    if (state.ready) runUserSql();
  });
  $("sql-run").addEventListener("click", () => runUserSql());
  $("sql-input").addEventListener("input", () => {
    state.sqlDirty = true;
  });
  $("sql-input").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      runUserSql();
    }
  });
  $("test-filter").addEventListener("input", () => {
    state.testFilter = $("test-filter").value;
    renderTests();
  });
  window.addEventListener("resize", () => {
    requestAnimationFrame(drawEdges);
  });
}

async function main() {
  const stored = localStorage.getItem("mercadoalba-lang");
  state.lang = stored === "en" ? "en" : "es";
  bind();
  applyLanguage();
  setStatus(t("loadingCatalog"));
  try {
    const response = await fetch(new URL("catalog.json", import.meta.url));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.catalog = await response.json();
  } catch (error) {
    setStatus(`${t("catalogError")} ${error.message || error}`);
    return;
  }
  state.nodes = [
    ...state.catalog.seeds.map((seed) => ({ ...seed, materialized: "seed" })),
    ...state.catalog.models,
  ];
  applyLanguage();
  renderLineage();
  renderDiagrams();
  startRun().catch((error) => {
    setStatus(`${t("wasmError")} ${error.message || error}`);
    state.running = false;
    setRunButton();
  });
}

main();

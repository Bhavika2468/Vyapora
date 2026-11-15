/* VYAPORA FRONTEND
   Demo mode works without a backend.
   BACKEND INTEGRATION:
   1) Add your deployed/local backend URL below.
   2) Set USE_BACKEND = true after your API routes are ready.
   3) Uncomment/adapt the fetch calls in the API functions.
   Never put Supabase service-role keys, Gemini keys, Groq keys or WhatsApp tokens here.
   All secret keys must remain on the backend.
*/
const API_BASE_URL = "http://localhost:5000"; // TODO: replace with your backend URL
const USE_BACKEND = false; // TODO: set true after backend endpoints are implemented

const demoInventory = [
  {id:1,name:"Basmati Rice",price:120,qty:2,unit:"kg",reorder:5,emoji:"🌾"},
  {id:2,name:"Mustard Oil",price:165,qty:3,unit:"litre",reorder:5,emoji:"🛢️"},
  {id:3,name:"Sugar",price:45,qty:4,unit:"kg",reorder:5,emoji:"🍬"},
  {id:4,name:"Wheat Flour (Atta)",price:38,qty:18,unit:"kg",reorder:5,emoji:"🌾"},
  {id:5,name:"Toor Dal",price:145,qty:12,unit:"kg",reorder:4,emoji:"🫘"},
  {id:6,name:"Tea",price:95,qty:22,unit:"packet",reorder:6,emoji:"🍵"},
  {id:7,name:"Bath Soap",price:35,qty:30,unit:"piece",reorder:8,emoji:"🧼"},
  {id:8,name:"Biscuits",price:10,qty:45,unit:"packet",reorder:10,emoji:"🍪"}
];
const demoOrders = [
  {id:"VP-1084",customer:"Priya Mehta",items:"Rice, Oil",amount:340,payment:"Pending",status:"Pending",date:"Today, 10:42"},
  {id:"VP-1083",customer:"Amit Verma",items:"Atta, Sugar",amount:210,payment:"Paid",status:"Completed",date:"Today, 10:18"},
  {id:"VP-1082",customer:"Neha Gupta",items:"Tea, Biscuits",amount:285,payment:"Paid",status:"Confirmed",date:"Today, 09:55"},
  {id:"VP-1081",customer:"Rohit Kumar",items:"Rice, Dal",amount:520,payment:"Udhaar",status:"Completed",date:"Yesterday"}
];
const demoCustomers = [
  {name:"Priya Mehta",phone:"+91 98765 10001",orders:18,value:8420,due:0,segment:"VIP"},
  {name:"Amit Verma",phone:"+91 98765 10002",orders:12,value:6240,due:1200,segment:"Loyal"},
  {name:"Neha Gupta",phone:"+91 98765 10003",orders:7,value:3180,due:640,segment:"Growing"},
  {name:"Rohit Kumar",phone:"+91 98765 10004",orders:3,value:1460,due:2500,segment:"New"},
  {name:"Anjali Singh",phone:"+91 98765 10005",orders:15,value:7180,due:3500,segment:"VIP"}
];
let inventory = [...demoInventory];
let orders = [...demoOrders];
let customers = [...demoCustomers];
let pendingPreview = [];

const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)}
function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function initials(name){return name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

// ---------------- BACKEND API ADAPTER ----------------
// Uncomment/adapt these functions when your backend routes are ready.
// Suggested routes are examples only; align them with your actual Express routes.
async function apiRequest(path, options={}) {
  if (!USE_BACKEND) throw new Error("Demo mode is enabled");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {"Content-Type":"application/json", ...(options.headers||{})}
    // TODO: add your auth/session token here using a secure session strategy.
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}
async function fetchInventoryFromBackend(){
  // TODO: connect GET /api/inventory
  // return await apiRequest("/api/inventory");
  return inventory;
}
async function saveInventoryToBackend(items){
  // TODO: connect POST /api/inventory/bulk-confirm
  // return await apiRequest("/api/inventory/bulk-confirm",{method:"POST",body:JSON.stringify({items})});
  return {success:true,items};
}
async function createOrderOnBackend(payload){
  // TODO: connect POST /api/orders
  // return await apiRequest("/api/orders",{method:"POST",body:JSON.stringify(payload)});
  return {success:true};
}
async function sendWhatsAppReminder(customerId,message){
  // TODO: connect POST /api/whatsapp/send
  // return await apiRequest("/api/whatsapp/send",{method:"POST",body:JSON.stringify({customerId,message})});
  return {success:true,demo:true};
}
// IMPORTANT: Voice transcription and AI extraction must happen on your backend.
// Do not call Gemini/Groq directly from browser JavaScript.

function navigate(page){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const active=$(`.nav-item[data-page="${page}"]`);
  $("#crumb").textContent=active?active.textContent.trim():({voice:"Voice inventory",insights:"Customer intelligence",language:"Local language AI",prune:"Prune AI monitor",settings:"Settings"}[page]||page);
  $("#sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
  if(page==="inventory")renderInventory();
  if(page==="orders")renderOrders();
  if(page==="customers")renderCustomers();
  if(page==="udhaar")renderUdhaar();
}
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));

function renderInventory(filter=""){
  const rows=inventory.filter(p=>p.name.toLowerCase().includes(filter.toLowerCase())).map(p=>`<tr>
    <td><div class="customer-cell"><span class="product-mini">${p.emoji||"📦"}</span><strong>${escapeHTML(p.name)}</strong></div></td>
    <td>${money(p.price)} / ${escapeHTML(p.unit)}</td><td>${p.qty} ${escapeHTML(p.unit)}</td><td>${p.reorder} ${escapeHTML(p.unit)}</td>
    <td><span class="status ${p.qty<=p.reorder?"Pending":"Completed"}">${p.qty<=p.reorder?"Low stock":"In stock"}</span></td>
    <td><button class="link-button" data-restock="${p.id}">＋ Restock</button></td></tr>`).join("");
  $("#inventoryRows").innerHTML=rows||'<tr><td colspan="6">No products found.</td></tr>';
  $("#productCount").textContent=inventory.length;
  $$("[data-restock]").forEach(b=>b.addEventListener("click",()=>openModal("restock",Number(b.dataset.restock))));
}
function renderOrders(filter="all",search=""){
  $("#orderRows").innerHTML=orders.filter(o=>(filter==="all"||o.status===filter)&&`${o.id} ${o.customer} ${o.items}`.toLowerCase().includes(search.toLowerCase())).map(o=>`<tr><td><strong>${o.id}</strong></td><td>${escapeHTML(o.customer)}</td><td>${escapeHTML(o.items)}</td><td><strong>${money(o.amount)}</strong></td><td>${escapeHTML(o.payment)}</td><td><span class="status ${o.status}">${o.status}</span></td><td>${o.date}</td></tr>`).join("")||'<tr><td colspan="7">No matching orders.</td></tr>';
}
function renderCustomers(){
  const q=($("#customerSearch")?.value||"").toLowerCase();
  $("#customerRows").innerHTML=customers.filter(c=>(c.name+c.phone).toLowerCase().includes(q)).map(c=>`<tr><td><div class="customer-cell"><span class="mini-avatar">${initials(c.name)}</span><strong>${escapeHTML(c.name)}</strong></div></td><td>${c.phone}</td><td>${c.orders}</td><td>${money(c.value)}</td><td>${money(c.due)}</td><td><span class="segment ${c.segment.toLowerCase()}">${c.segment}</span></td></tr>`).join("")||'<tr><td colspan="6">No customers found.</td></tr>';
}
function renderUdhaar(){
  const q=($("#udhaarSearch")?.value||"").toLowerCase();
  $("#udhaarRows").innerHTML=customers.filter(c=>c.due>0&&c.name.toLowerCase().includes(q)).map(c=>`<tr><td><div class="customer-cell"><span class="mini-avatar">${initials(c.name)}</span><strong>${escapeHTML(c.name)}</strong></div></td><td>Recorded payment</td><td><strong>${money(c.due)}</strong></td><td>Recent activity</td><td><span class="status ${c.due>2000?"Overdue":"Pending"}">${c.due>2000?"Follow up":"Reminder due"}</span></td><td><button class="link-button" data-remind="${escapeHTML(c.name)}">Prepare reminder</button></td></tr>`).join("")||'<tr><td colspan="6">No outstanding balances.</td></tr>';
  $$("[data-remind]").forEach(b=>b.addEventListener("click",async()=>{await sendWhatsAppReminder(b.dataset.remind,"Friendly payment reminder");toast("Demo reminder prepared. Connect WhatsApp backend to send.");}));
}
$("#inventorySearch").addEventListener("input",e=>renderInventory(e.target.value));
$("#orderSearch").addEventListener("input",e=>renderOrders($(".filter-chip.active")?.dataset.filter||"all",e.target.value));
$("#customerSearch").addEventListener("input",renderCustomers);
$("#udhaarSearch").addEventListener("input",renderUdhaar);
$$(".filter-chip").forEach(b=>b.addEventListener("click",()=>{$$(".filter-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderOrders(b.dataset.filter,$("#orderSearch").value)}));

// ---------------- VOICE INVENTORY PREVIEW ----------------
// Browser speech recognition is a demo convenience. Production WhatsApp audio
// should be downloaded and transcribed by your backend, then passed to your AI service.
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
let recognition=null;
if(SpeechRecognition){
  recognition=new SpeechRecognition();recognition.continuous=false;recognition.interimResults=true;
  recognition.onstart=()=>{$("#micTitle").textContent="Listening...";$("#micHelp").textContent="Speak your products clearly.";$("#recordBtn").textContent="■ Stop listening";$("#micStage")?.classList.add("recording");$("#transcriptState").textContent="Listening";};
  recognition.onresult=e=>{let text="";for(let i=e.resultIndex;i<e.results.length;i++)text+=e.results[i][0].transcript;$("#transcriptText").textContent=text;$("#voiceTextInput").value=text;};
  recognition.onerror=e=>{toast("Speech recognition issue: "+e.error);resetMic()};
  recognition.onend=()=>{resetMic();if($("#voiceTextInput").value.trim())parseInventoryText($("#voiceTextInput").value)};
}
function resetMic(){$("#recordBtn").textContent="● Start speaking";$("#micTitle").textContent="Ready when you are";$("#micHelp").textContent="Tap the microphone and speak your stock update.";$("#transcriptState").textContent="Voice input captured";$("#micStage")?.classList.remove("recording");}
$("#recordBtn").addEventListener("click",()=>{
  if(!recognition){toast("Speech recognition is not supported here. Type your stock update below.");return;}
  if($("#recordBtn").textContent.includes("Stop"))recognition.stop();
  else{recognition.lang=$("#voiceLanguage").value;recognition.start();}
});
$("#parseTextBtn").addEventListener("click",()=>parseInventoryText($("#voiceTextInput").value));
$$("[data-example]").forEach(b=>b.addEventListener("click",()=>{$("#voiceTextInput").value=b.dataset.example;$("#transcriptText").textContent=b.dataset.example;parseInventoryText(b.dataset.example)}));

function parseInventoryText(text){
  if(!text.trim()){toast("Speak or type the inventory items first.");return;}
  // Demo parser for common examples. Replace with POST /api/ai/inventory-preview
  // Your backend should use speech transcription + Gemini/Groq and return normalized JSON.
  const catalog=[
    {keys:["chini","cheeni","sugar"],name:"Sugar",unit:"kg",emoji:"🍬"},
    {keys:["chawal","rice"],name:"Rice",unit:"kg",emoji:"🌾"},
    {keys:["sarson ka tel","mustard oil","tel","oil"],name:"Mustard Oil",unit:"litre",emoji:"🛢️"},
    {keys:["aata","atta","flour"],name:"Wheat Flour (Atta)",unit:"kg",emoji:"🌾"},
    {keys:["dal","daal","pulses"],name:"Toor Dal",unit:"kg",emoji:"🫘"},
    {keys:["biscuit","biscuits"],name:"Biscuits",unit:"packet",emoji:"🍪"},
    {keys:["paani","water"],name:"Water",unit:"bottle",emoji:"💧"}
  ];
  const normalized=text.toLowerCase();let found=[];
  const qtyPatterns=[{re:/aadha|adha|half|0\.5|\.5/,qty:.5},{re:/paav|pav|quarter|0\.25/,qty:.25},{re:/do |two |2 /,qty:2},{re:/teen |three |3 /,qty:3},{re:/char |four |4 /,qty:4},{re:/paanch |five |5 /,qty:5},{re:/ek |one |1 /,qty:1}];
  catalog.forEach(p=>{
    const key=p.keys.find(k=>normalized.includes(k));
    if(key){
      let before=normalized.slice(Math.max(0,normalized.indexOf(key)-22),normalized.indexOf(key));
      let qty=1;for(const q of qtyPatterns)if(q.re.test(before)){qty=q.qty;}
      const unit=p.unit;found.push({name:p.name,quantity:qty,unit,emoji:p.emoji,type:"restock"});
    }
  });
  if(!found.length){toast("Demo parser could not identify products. Connect the backend AI extraction endpoint for full language support.");return;}
  pendingPreview=found;renderPreview();$("#inventoryPreview").classList.remove("hidden");$("#inventoryPreview").scrollIntoView({behavior:"smooth",block:"start"});
}
function renderPreview(){
  $("#previewRows").innerHTML=pendingPreview.map((p,i)=>`<tr><td><strong>${p.emoji||"📦"} ${escapeHTML(p.name)}</strong></td><td><input aria-label="Quantity" type="number" min="0.01" step="0.01" value="${p.quantity}" data-qty="${i}" style="width:75px;padding:6px;border:1px solid #e5e9ee;border-radius:5px"></td><td><select data-unit="${i}" style="padding:6px;border:1px solid #e5e9ee;border-radius:5px"><option ${p.unit==="kg"?"selected":""}>kg</option><option ${p.unit==="litre"?"selected":""}>litre</option><option ${p.unit==="packet"?"selected":""}>packet</option><option ${p.unit==="bottle"?"selected":""}>bottle</option><option>piece</option></select></td><td><span class="tag tag-green">Restock</span></td><td><button class="link-button" data-remove="${i}">Remove</button></td></tr>`).join("");
  $("#previewCount").textContent=`${pendingPreview.length} products detected`;
  $$("[data-remove]").forEach(b=>b.addEventListener("click",()=>{pendingPreview.splice(Number(b.dataset.remove),1);renderPreview()}));
  $$("[data-qty]").forEach(i=>i.addEventListener("change",()=>pendingPreview[Number(i.dataset.qty)].quantity=Number(i.value)));
  $$("[data-unit]").forEach(i=>i.addEventListener("change",()=>pendingPreview[Number(i.dataset.unit)].unit=i.value));
}
$("#cancelPreview").addEventListener("click",()=>{$("#inventoryPreview").classList.add("hidden");pendingPreview=[];toast("Preview discarded. Inventory was not changed.")});
$("#confirmInventory").addEventListener("click",async()=>{
  if(!pendingPreview.length){toast("No products to save.");return;}
  const result=await saveInventoryToBackend(pendingPreview);
  if(!result.success){toast("Could not save inventory.");return;}
  pendingPreview.forEach(item=>{
    const existing=inventory.find(p=>p.name.toLowerCase()===item.name.toLowerCase()&&p.unit===item.unit);
    if(existing)existing.qty+=Number(item.quantity);
    else inventory.push({id:Date.now()+Math.random(),name:item.name,price:0,qty:Number(item.quantity),unit:item.unit,reorder:3,emoji:item.emoji});
  });
  renderInventory();$("#inventoryPreview").classList.add("hidden");pendingPreview=[];toast("Inventory updated in demo mode. Connect backend to persist to database.");
  navigate("inventory");
});

// ---------------- MODALS / DEMO ACTIONS ----------------
const modalSchemas={
  addProduct:{title:"Add product",fields:[["name","Product name","text","e.g. Moong Dal"],["price","Selling price (₹)","number","e.g. 120"],["qty","Opening stock","number","e.g. 10"],["unit","Unit","select",["kg","litre","packet","piece","bottle"]],["reorder","Low-stock threshold","number","e.g. 3"]]},
  restock:{title:"Restock product",fields:[["qty","Quantity to add","number","e.g. 10"]]},
  newOrder:{title:"Create order",fields:[["customer","Customer name","text","Customer name"],["items","Items","text","e.g. Rice, Oil"],["amount","Order amount (₹)","number","e.g. 350"]]},
  addCustomer:{title:"Add customer",fields:[["name","Customer name","text","Full name"],["phone","Phone number","tel","+91"],["segment","Customer segment","select",["New","Growing","Loyal","VIP"]]]},
  recordPayment:{title:"Record payment",fields:[["customer","Customer name","text","Customer name"],["amount","Payment amount (₹)","number","e.g. 500"]]}
};
let modalContext=null;
function openModal(type,id=null){
  modalContext={type,id};const schema=modalSchemas[type];$("#modalTitle").textContent=schema.title;
  $("#modalFields").innerHTML=schema.fields.map(([name,label,kind,placeholder])=>`<label class="modal-field">${label}${kind==="select"?`<select name="${name}">${placeholder.map(v=>`<option>${v}</option>`).join("")}</select>`:`<input name="${name}" type="${kind}" placeholder="${placeholder}" required ${kind==="number"?'min="0" step="0.01"':""}>`}</label>`).join("");
  $("#modalBackdrop").classList.remove("hidden");
}
function closeModal(){$("#modalBackdrop").classList.add("hidden");$("#modalForm").reset();modalContext=null}
$$("[data-modal]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.modal)));
$("#closeModal").addEventListener("click",closeModal);$("#cancelModal").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
$("#modalForm").addEventListener("submit",async e=>{
  e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());const type=modalContext.type;
  if(type==="addProduct"){inventory.push({id:Date.now(),name:data.name,price:Number(data.price),qty:Number(data.qty),unit:data.unit,reorder:Number(data.reorder),emoji:"📦"});renderInventory();toast("Product added in demo mode.");}
  if(type==="restock"){const p=inventory.find(x=>x.id===modalContext.id);if(p){p.qty+=Number(data.qty);renderInventory();toast(`${p.name} restocked in demo mode.`)}}
  if(type==="newOrder"){const order={id:"VP-"+(1085+orders.length),customer:data.customer,items:data.items,amount:Number(data.amount),payment:"Pending",status:"Pending",date:"Just now"};orders.unshift(order);await createOrderOnBackend(order);renderOrders();toast("Order created in demo mode.");}
  if(type==="addCustomer"){customers.push({name:data.name,phone:data.phone,orders:0,value:0,due:0,segment:data.segment});renderCustomers();toast("Customer added in demo mode.");}
  if(type==="recordPayment"){const c=customers.find(x=>x.name.toLowerCase()===data.customer.toLowerCase());if(c){c.due=Math.max(0,c.due-Number(data.amount));renderUdhaar();toast("Payment recorded in demo mode. Verify actual payment before recording in production.");}else toast("Customer not found in demo data.");}
  closeModal();
});
$$("[data-toast]").forEach(b=>b.addEventListener("click",()=>toast(b.dataset.toast)));
$$(".settings-tab").forEach(b=>b.addEventListener("click",()=>{$$(".settings-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");toast("Demo settings section. Connect the relevant backend endpoint.")}));

// Initial rendering
renderInventory();renderOrders();renderCustomers();renderUdhaar();

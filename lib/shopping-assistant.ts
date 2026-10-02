import type {Product} from './catalog';
export type ChatMessage={role:'user'|'assistant';content:string};
export type OrderSummary={id:string;status:string;total:number;created_at:string};
const money=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const stop=new Set('a an the i me my you your for find show suggest recommend please want need some something to of in is are it and or with best buy products product under below less than price budget compare between which would can get'.split(' '));
export function selectProducts(messages:ChatMessage[],products:Product[]){
 const last=messages.at(-1)!.content.toLowerCase();
 const previous=messages.slice(0,-1).filter(m=>m.role==='user').at(-1)?.content.toLowerCase()||'';
 const categoryTerms=/backpack|bag|shirt|tee|jacket|ring|bracelet|earring|monitor|ssd|drive|electronics|fashion|accessories|men|women/;
 const text=!categoryTerms.test(last)&&/cheaper|under|below|instead|those|these|them|compare|budget/.test(last)?previous+' '+last:last;
 const budgetMatches=[...text.matchAll(/(?:under|below|less than|budget(?: of)?|up to|max(?:imum)?)[\s:₹]*(?:rs\.?\s*)?([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh)?/g)];
 const b=budgetMatches.at(-1);const budget=b?Number(b[1].replaceAll(',',''))*(b[2]==='k'||b[2]==='thousand'?1000:b[2]==='lakh'?100000:1):Infinity;
 const tokens=text.replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(t=>t.length>1&&!stop.has(t)&&!/^[\d]+$/.test(t)).map(t=>t.length>3&&t.endsWith('s')?t.slice(0,-1):t);
 let category:string|undefined;if(/\bwomen|female|ladies/.test(text))category='Women';else if(/\bmen|male/.test(text))category='Men';else if(/electronics|monitor|ssd|drive/.test(text))category='Electronics';else if(/accessories|jewel|ring|bracelet|earring/.test(text))category='Accessories';
 const candidates=products.filter(p=>p.stock>0&&p.price<=budget&&(!category||p.category===category));
 const scored=candidates.map(p=>{const name=p.name.toLowerCase(),details=(p.description+' '+p.category).toLowerCase();const score=tokens.reduce((s,t)=>s+(name.includes(t)?5:details.includes(t)?1:0),0);return {p,score};}).sort((a,b)=>b.score-a.score||a.p.price-b.p.price);
 const matches=scored.filter(x=>x.score>0);const general=/recommend|suggest|find|show|shop|gift|deal|bestseller|top rated|cheapest/.test(text)||Number.isFinite(budget);
 const unknown=tokens.some(t=>!['gift','deal','bestseller','top','rated','cheapest','shop','option'].includes(t));
 const chosen=matches.length?matches.map(x=>x.p):unknown||!general?[]:candidates.sort((a,b)=>/cheap|budget|under|below/.test(text)?a.price-b.price:b.rating-a.rating);
 return {products:chosen.slice(0,3),budget,query:text};
}
export function catalogReply(messages:ChatMessage[],products:Product[],orders:OrderSummary[]){
 const last=messages.at(-1)!.content.toLowerCase();let reply='';let picks:Product[]=[];
 if(/\b(delivery|shipping|ship|deliver)\b/.test(last)&&!/order|track|status/.test(last))reply='Demo delivery is free on orders of ₹999 or more. Below ₹999, the delivery fee is ₹99. No items are actually shipped because NexaMart is a demo store.';
 else if(/order|track|status/.test(last)){reply=orders.length?'Your latest demo orders:\n'+orders.map(o=>`#${o.id.slice(0,8).toUpperCase()} — ${o.status}, ${money(o.total)}`).join('\n')+'\nOpen Orders for details. These are test orders with no real shipment.':'You have no saved demo orders yet. Add a product to your cart and use demo checkout to create one.';}
 else if(/return|refund|cancel/.test(last))reply='NexaMart does not process real purchases, returns or refunds. Orders are for testing only; no money is charged. You can remove cart items before placing an order.';
 else if(/payment|pay|checkout|card|upi|cod/.test(last))reply='Add products to your cart, choose Continue to demo checkout, and enter your delivery details. Checkout saves a test order and updates stock. No payment or card details are collected.';
 else if(/sign.?in|login|account/.test(last))reply='Use Account → Sign in with ChatGPT. Your cart, favourites and demo orders are saved to your account.';
 else if(/\b(hi|hello|hey)\b/.test(last)&&last.length<25)reply='Hi! I can help you find products, compare options, or explain demo delivery and checkout. Tell me what you want and your budget in rupees.';
 else if(/\b(cart|basket)\b/.test(last)&&!/backpack|jacket|shirt|ring|ssd|drive|monitor/.test(last))reply='Use the + button on a product to add it to your cart. Open Cart to adjust quantities or remove items. I can recommend products, but you choose when to add them or check out.';
 else{const result=selectProducts(messages,products);picks=result.products;if(!picks.length)reply='I couldn’t find an in-stock match'+(Number.isFinite(result.budget)?` within ${money(result.budget)}`:'')+'. Try electronics, clothing, a backpack, or accessories, and include your budget.';else if(/compare|difference|which/.test(last))reply='Here are matching options to compare:\n'+picks.map(p=>`${p.name} — ${money(p.price)}, ${p.rating}/5 sample rating, ${p.stock} units in stock.`).join('\n')+'\nOpen a product to read its specifications before choosing.';else reply='Here are in-stock options'+(Number.isFinite(result.budget)?` within ${money(result.budget)}`:' from the catalog')+':\n'+picks.map(p=>`${p.name} — ${money(p.price)}`).join('\n')+'\nOpen a product to review the details.';}
 return {reply,products:picks};
}
export function normalizeMessages(value:unknown):ChatMessage[]{
 if(!Array.isArray(value)||value.length<1||value.length>12)throw new Error('Send between 1 and 12 messages.');
 let size=0;const messages=value.map((m:any)=>{if(!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>2000)throw new Error('Each message must be text of up to 2,000 characters.');size+=m.content.length;return {role:m.role,content:m.content.trim()} as ChatMessage;});
 if(size>12000||messages.at(-1)?.role!=='user')throw new Error('Conversation is too long or missing a question.');return messages;
}
export function responseText(payload:any){return (Array.isArray(payload.output)?payload.output:[]).filter((o:any)=>o.type==='message').flatMap((o:any)=>Array.isArray(o.content)?o.content:[]).filter((c:any)=>c.type==='output_text'&&typeof c.text==='string').map((c:any)=>c.text).join('');}

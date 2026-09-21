/* Vijay Connect Supabase bridge
   Replace only these two values before deployment.
   Use the Supabase Project URL and the PUBLISHABLE key (sb_publishable_...).
   Never put a service_role/secret key here.
*/
window.VC_SUPABASE_CONFIG = window.VC_SUPABASE_CONFIG || {
  url: 'https://fofjfmxlhbkzimisygke.supabase.co',
  key: 'sb_publishable_PsGH36IaqH2SEl_HFEDfPg_knk27K8U',
  table: 'selva_setting',
  rowId: 1
};

(function(){
  const cfg=window.VC_SUPABASE_CONFIG;
  const baseUrl=()=>String(cfg?.url||'').trim().replace(/\/+$/,'').replace(/\/rest\/v1$/,'');
  const ready=()=>cfg && baseUrl() && cfg.key && !baseUrl().includes('YOUR_') && !String(cfg.key).includes('YOUR_') && /^https:\/\/[^\s]+$/.test(baseUrl());
  window.VC_REMOTE_READY=ready;
  window.VC_REMOTE_ENABLED=ready();
  window.VC_remoteLoad=async function(){
    if(!ready()) return null;
    try{
      const r=await fetch(`${baseUrl()}/rest/v1/${cfg.table}?id=eq.${cfg.rowId}&select=id,data`,{
        headers:{apikey:cfg.key,Authorization:`Bearer ${cfg.key}`}
      });
      if(!r.ok) throw new Error('Remote read failed '+r.status);
      const rows=await r.json();
      return rows[0]?.data || null;
    }catch(e){ console.warn('Vijay Connect remote load:',e); return null; }
  };
  window.VC_remoteSave=async function(data, accessToken){
    if(!ready()) throw new Error('Supabase config is not set.');
    if(!accessToken) throw new Error('Owner session missing. Please login again.');
    const r=await fetch(`${baseUrl()}/rest/v1/${cfg.table}?on_conflict=id`,{
      method:'POST',
      headers:{apikey:cfg.key,Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify({id:cfg.rowId,data})
    });
    if(!r.ok){ const t=await r.text(); throw new Error('Remote save failed '+r.status+' '+t); }
    return true;
  };
  window.VC_remoteAuth=async function(email,password){
    if(!ready()) throw new Error('Supabase config is not set.');
    const r=await fetch(`${baseUrl()}/auth/v1/token?grant_type=password`,{
      method:'POST',headers:{apikey:cfg.key,'Content-Type':'application/json'},body:JSON.stringify({email,password})
    });
    const j=await r.json();
    if(!r.ok) throw new Error(j.error_description||j.msg||'Login failed');
    return j;
  };
  // Dashboard authentication is intentionally memory-only. No owner session is persisted in localStorage.
  window.VC_remoteLogout=()=>{};
  window.VC_remoteSession=()=>null;
  if(ready() && !location.pathname.includes('vc-control-7f4k2')){
    document.addEventListener('DOMContentLoaded', async ()=>{
      if(sessionStorage.getItem('vcRemoteHydrated')==='1') return;
      const remote=await window.VC_remoteLoad();
      if(!remote) return;
      let changed=false;
      for(const [k,v] of Object.entries(remote)){ if(k.startsWith('vijay')){ const next=typeof v==='string'?v:JSON.stringify(v); if(localStorage.getItem(k)!==next){localStorage.setItem(k,next);changed=true;} } }
      if(changed){ sessionStorage.setItem('vcRemoteHydrated','1'); location.reload(); }
    });
  }
})();

// V30 customer account helpers: phone OTP + cloud profile + booking history.
(function(){
  const cfg=window.VC_SUPABASE_CONFIG;
  const base=()=>String(cfg?.url||'').trim().replace(/\/+$/,'');
  const customerReady=()=>window.VC_REMOTE_READY && VC_REMOTE_READY();
  async function authFetch(path,body){
    if(!customerReady()) throw new Error('Supabase config is not set.');
    const r=await fetch(base()+path,{method:'POST',headers:{apikey:cfg.key,'Content-Type':'application/json'},body:JSON.stringify(body)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(j.error_description||j.msg||j.message||'Authentication failed');
    return j;
  }
  window.VC_customerSignUp=async function(email,password){
    const j=await authFetch('/auth/v1/signup',{email,password});
    return j;
  };
  function customerOAuth(provider){
    if(!customerReady()) throw new Error('Supabase config is not set.');
    const redirect=location.origin+location.pathname+location.search;
    location.href=base()+'/auth/v1/authorize?provider='+encodeURIComponent(provider)+'&redirect_to='+encodeURIComponent(redirect)+'&flow_type=implicit';
  }
  window.VC_customerGoogleSignIn=function(){customerOAuth('google');};
  window.VC_customerFacebookSignIn=function(){customerOAuth('facebook');};
  window.VC_customerSignIn=async function(email,password){
    return authFetch('/auth/v1/token?grant_type=password',{email,password});
  };
  window.VC_customerSignOut=async function(accessToken){
    if(!accessToken) return true;
    if(!customerReady()) return true;
    const r=await fetch(base()+'/auth/v1/logout',{method:'POST',headers:{apikey:cfg.key,Authorization:'Bearer '+accessToken}});
    if(!r.ok) throw new Error('Could not end the unverified session.');
    return true;
  };
  window.VC_customerResetPassword=async function(email,redirectTo){
    return authFetch('/auth/v1/recover',{email,redirect_to:redirectTo||location.origin+location.pathname});
  };
  window.VC_customerSendOtp=async function(phone,createUser=true){return authFetch('/auth/v1/otp',{phone,create_user:createUser});};
  window.VC_customerVerifyOtp=async function(phone,token){return authFetch('/auth/v1/verify',{phone,token,type:'sms'});};
  window.VC_customerRefresh=async function(refreshToken){return authFetch('/auth/v1/token?grant_type=refresh_token',{refresh_token:refreshToken});};
  async function authedFetch(path,token,options={}){
    if(!token) throw new Error('Customer session missing.');
    const headers=Object.assign({'apikey':cfg.key,'Authorization':'Bearer '+token,'Content-Type':'application/json'},options.headers||{});
    const r=await fetch(base()+path,Object.assign({},options,{headers}));
    const text=await r.text(); let j={}; try{j=text?JSON.parse(text):{}}catch(e){j={message:text}};
    if(!r.ok) throw new Error(j.message||j.error_description||j.msg||('Request failed '+r.status));
    return j;
  }
  window.VC_customerSaveProfile=async function(token,userId,fullName,phone){
    return authedFetch('/rest/v1/customer_profiles?on_conflict=id',token,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({id:userId,full_name:fullName,phone,updated_at:new Date().toISOString()})});
  };
  window.VC_customerGetProfile=async function(token,userId){
    const rows=await authedFetch('/rest/v1/customer_profiles?id=eq.'+encodeURIComponent(userId)+'&select=id,full_name,phone,created_at,updated_at',token,{method:'GET'}); return rows?.[0]||null;
  };
  window.VC_customerGetBookings=async function(token,userId){
    const rows=await authedFetch('/rest/v1/customer_bookings?customer_id=eq.'+encodeURIComponent(userId)+'&select=booking_id,service,vehicle,fare,pickup,dropoff,travel_date,pickup_time,mobile,status,created_at&order=created_at.desc',token,{method:'GET'}); return Array.isArray(rows)?rows:[];
  };
  window.VC_customerSaveBooking=async function(token,booking,userId){
    return authedFetch('/rest/v1/customer_bookings',token,{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({customer_id:userId,booking_id:booking.id,service:booking.service,vehicle:booking.vehicle,fare:booking.fare,pickup:booking.from,dropoff:booking.to,travel_date:booking.date,pickup_time:booking.time,mobile:booking.mobile,status:booking.status})});
  };
})();

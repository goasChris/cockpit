import{c,u,l as f,m as y,n as a,t as p,q as t,v as A,y as n,z as o,E as i,B as l}from"./index-BogId3i5.js";const g={class:"inline-block font-extrabold align-middle unselectable"},h=c({__name:"ArmerButton",setup(b){const e=u(),m=()=>{n(async()=>l(e.arm),{command:"Arm"},o(i.ARM))},d=()=>{n(async()=>l(e.disarm),{command:"Disarm"},o(i.DISARM))};return(s,r)=>(f(),y("button",{class:"relative flex items-center justify-center w-32 p-1 rounded-md shadow-inner h-9 bg-slate-800/60",onClick:r[0]||(r[0]=v=>t(e).isArmed?d():m())},[a("div",{class:A(["absolute top-auto flex items-center px-1 rounded-[4px] shadow transition-all w-[70%] h-[80%]",t(e).isArmed===void 0?"justify-start bg-slate-800/60 text-slate-400 left-[4%]":t(e).isArmed?"bg-red-700 hover:bg-red-800 text-slate-50 justify-end left-[26%]":"bg-green-700 hover:bg-green-800 text-slate-400 justify-start left-[4%]"])},[a("span",g,p(t(e).isArmed===void 0?"...":t(e).isArmed?"Armed":"Disarmed"),1)],2)]))}});export{h as default};
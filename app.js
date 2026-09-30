'use strict';
const stages={"frog":[{"title":"البيضة","desc":"تضع أنثى الضفدع بيوضها في الماء."},{"title":"أبو ذنيبة","desc":"يفقس من البيضة، ويسبح بذيله، ويتنفس بالخياشيم."},{"title":"الضفدع الصغير","desc":"تبدأ الأرجل والرئتان بالتكوّن، ويتناقص الذيل."},{"title":"الضفدع مكتمل النمو","desc":"ينتقل إلى اليابسة ويصبح قادرًا على التكاثر."}],"camel":[{"title":"حديث الولادة","desc":"يشبه أبويه، ويحتاج إلى الرعاية والغذاء من أمه."},{"title":"الجمل الصغير","desc":"ينمو ويتعلم تدريجيًا الاعتماد على نفسه."},{"title":"الجمل مكتمل النمو","desc":"يعتمد على نفسه ويصبح قادرًا على التكاثر."}]};
const questions=[{"q":"أين تضع أنثى الضفدع بيوضها؟","options":["في الرمل","في الماء","على الأشجار"],"answer":1,"why":"تضع أنثى الضفدع بيوضها في الماء."},{"q":"كيف يتنفس أبو ذنيبة؟","options":["بالخياشيم","بالرئتين فقط","بالأنف مثل الجمل"],"answer":0,"why":"يتنفس أبو ذنيبة بالخياشيم في الماء."},{"q":"ما الترتيب الصحيح لنمو الضفدع؟","options":["ضفدع صغير، بيضة، أبو ذنيبة","أبو ذنيبة، بيضة، ضفدع","بيضة، أبو ذنيبة، ضفدع صغير، ضفدع مكتمل النمو"],"answer":2,"why":"تبدأ حياة الضفدع من البيضة، ثم أبو ذنيبة، ثم الضفدع الصغير، ثم مكتمل النمو."},{"q":"إلى أي مجموعة ينتمي الجمل؟","options":["الثدييات","البرمائيات","الأسماك"],"answer":0,"why":"الجمل من الثدييات؛ تلد الأنثى صغيرها وترضعه."},{"q":"ماذا يتعلم الجمل الصغير قبل أن يتكاثر؟","options":["وضع البيوض","التنفس بالخياشيم","الاعتماد على نفسه"],"answer":2,"why":"يتعلم الجمل الصغير الاعتماد على نفسه، ويتكاثر بعد اكتمال نموه."},{"q":"أي الحيوانين يمر بالتحوّل؟","options":["الجمل","الضفدع","كلاهما"],"answer":1,"why":"يتغيّر شكل الضفدع بوضوح في أثناء نموه؛ وتسمى هذه العملية التحوّل."}];
const $=id=>document.getElementById(id);
const selected={frog:0,camel:0};
let sound=true,audioContext=null,toastTimer=null,activeUtterance=null;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('toast').hidden=true},4500)}
function speak(text){
 if(!sound){toast('فعّل الأصوات من أعلى الصفحة للاستماع.');return}
 if(!('speechSynthesis' in window)){toast('الشرح الصوتي غير متاح في هذا المتصفح. يمكنك قراءة الشرح المكتوب.');return}
 window.speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(text);activeUtterance=utterance;utterance.lang='ar-SA';utterance.rate=.85;
 const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang==='ar-SA')||voices.find(v=>v.lang.startsWith('ar'));
 if(voice)utterance.voice=voice;
 utterance.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')toast('تعذّر تشغيل الشرح الصوتي. تأكد من توفر صوت عربي على الجهاز.')};
 utterance.onend=()=>{activeUtterance=null};
 window.speechSynthesis.speak(utterance);
}
function stopSpeech(){if('speechSynthesis' in window)window.speechSynthesis.cancel()}
function tone(freq,duration=.15,delay=0,type='sine'){
 if(!sound)return;
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 audioContext=audioContext||new AC();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
 const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime+delay;
 o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
 o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+duration+.03);
 }catch(e){}
}
$('sound-toggle').addEventListener('click',()=>{
 sound=!sound;$('sound-toggle').setAttribute('aria-pressed',String(sound));$('sound-toggle').textContent=sound?'♫ الأصوات مفعّلة':'♫ الأصوات مكتومة';
 if(!sound){stopSpeech();if(audioContext)audioContext.suspend().catch(()=>{})}else tone(440);
});
document.querySelectorAll('.stage').forEach(button=>button.addEventListener('click',()=>{
 const animal=button.dataset.animal,index=Number(button.dataset.stage);selected[animal]=index;
 document.querySelectorAll('[data-animal="'+animal+'"]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const item=stages[animal][index],detail=$(animal+'-detail');detail.querySelector('h4').textContent=item.title;detail.querySelector('p').textContent=item.desc;tone(440+index*80,.09);
}));
document.querySelectorAll('[data-listen]').forEach(button=>button.addEventListener('click',()=>{const animal=button.dataset.listen,item=stages[animal][selected[animal]];speak(item.title+'. '+item.desc)}));
document.querySelectorAll('[data-read-all]').forEach(button=>button.addEventListener('click',()=>{const animal=button.dataset.readAll;speak('دورة حياة '+(animal==='frog'?'الضفدع':'الجمل')+'. '+stages[animal].map(s=>s.title+'. '+s.desc).join(' '))}));
$('intro-listen').addEventListener('click',()=>speak('مرحبًا بكم في رحلة الحياة. أنا شيهانة مقرن المطيري. هذا مشروعي في مادة العلوم للصف الثالث الابتدائي. سنتعرف على دورة حياة الضفدع والجمل، ثم نختبر معلوماتنا في مسابقة ممتعة.'));
$('croak').addEventListener('click',()=>{if(!sound){toast('فعّل الأصوات أولًا.');return}stopSpeech();for(let i=0;i<4;i++){tone(110,.18,i*.3,'sawtooth');tone(145,.10,i*.3+.07,'triangle')}});
let current=0,score=0,locked=false,answers=[],finished=false;
function startQuiz(){stopSpeech();current=0;score=0;locked=false;finished=false;answers=[];$('quiz-welcome').hidden=true;$('quiz-result').hidden=true;$('quiz-play').hidden=false;document.querySelectorAll('.confetti').forEach(e=>e.remove());renderQuestion()}
function renderQuestion(){
 locked=false;const q=questions[current];$('quiz-count').textContent='السؤال '+(current+1).toLocaleString('ar-SA')+' من ٦';$('quiz-score').textContent='النقاط: '+score.toLocaleString('ar-SA');
 $('quiz-progress').value=current;$('question').textContent=q.q;$('options').replaceChildren();$('feedback').hidden=true;$('next-question').hidden=true;
 q.options.forEach((text,i)=>{const b=document.createElement('button');b.className='option';const letter=document.createElement('span');letter.className='letter';letter.textContent=['أ','ب','ج'][i];const label=document.createElement('span');label.textContent=text;b.append(letter,label);b.addEventListener('click',()=>choose(i));$('options').append(b)});
 $('question').focus({preventScroll:true});
}
function choose(index){
 if(locked||finished||!Number.isInteger(index)||index<0||index>=questions[current].options.length)return;
 locked=true;const q=questions[current],correct=index===q.answer;answers.push(index);if(correct)score++;
 Array.from($('options').children).forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add('correct');else if(i===index)b.classList.add('wrong')});
 $('quiz-score').textContent='النقاط: '+score.toLocaleString('ar-SA');$('quiz-progress').value=current+1;
 $('feedback').textContent=(correct?'أحسنت! ':'نتعلم من كل محاولة. ')+q.why;$('feedback').hidden=false;
 $('next-question').textContent=current===questions.length-1?'شاهد النتيجة ✦':'السؤال التالي ←';$('next-question').hidden=false;
 if(correct){tone(523,.14);tone(659,.18,.14)}else tone(260,.17);
}
function nextQuestion(){if(!locked||finished)return;if(current===questions.length-1){showResult();return}current++;renderQuestion()}
function showResult(){
 finished=true;stopSpeech();$('quiz-play').hidden=true;$('quiz-result').hidden=false;$('final-score').textContent=score.toLocaleString('ar-SA');
 $('result-title').textContent=score===6?'مستكشف متميز!':score>=4?'اكتشاف رائع!':'كل محاولة تزيد معرفتك!';
 $('result-message').textContent=score===6?'أجبت عن جميع الأسئلة إجابة صحيحة. أحسنت!':'أجبت عن '+score.toLocaleString('ar-SA')+' أسئلة إجابة صحيحة. راجع الإجابات ثم حاول من جديد.';
 $('review').replaceChildren();
 questions.forEach((q,i)=>{const d=document.createElement('div');d.className='review-item';const title=document.createElement('strong');title.textContent=(answers[i]===q.answer?'✓ ':'○ ')+q.q;const detail=document.createElement('span');detail.textContent='إجابتك: '+q.options[answers[i]]+' · الإجابة الصحيحة: '+q.options[q.answer];d.append(title,detail);$('review').append(d)});
 if(score>=4){celebrate();tone(523,.15);tone(659,.15,.17);tone(784,.25,.34)}
 $('quiz-result').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
}
function celebrate(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<35;i++){const piece=document.createElement('i');piece.className='confetti';piece.style.left=Math.random()*100+'%';piece.style.background=['#d9af64','#76ab68','#ad91bd','#73b6af'][i%4];piece.style.animationDelay=Math.random()*.6+'s';document.body.append(piece);setTimeout(()=>piece.remove(),3800)}}
$('start-quiz').addEventListener('click',startQuiz);$('restart-quiz').addEventListener('click',startQuiz);$('next-question').addEventListener('click',nextQuestion);
$('print-result').addEventListener('click',()=>{document.body.classList.add('printing-result');window.print();document.body.classList.remove('printing-result')});
window.addEventListener('pagehide',stopSpeech);

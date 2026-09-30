'use strict';
const stages={"frog":[{"title":"البيضة","desc":"تضع أنثى الضفدع بيوضها في الماء."},{"title":"أبو ذنيبة","desc":"يفقس من البيضة، ويسبح بذيله، ويتنفس بالخياشيم."},{"title":"الضفدع الصغير","desc":"تبدأ الأرجل والرئتان بالتكوّن، ويتناقص الذيل."},{"title":"الضفدع مكتمل النمو","desc":"ينتقل إلى اليابسة ويصبح قادرًا على التكاثر."}],"camel":[{"title":"حديث الولادة","desc":"يشبه أبويه، ويحتاج إلى الرعاية والغذاء من أمه."},{"title":"الجمل الصغير","desc":"ينمو ويتعلم تدريجيًا الاعتماد على نفسه."},{"title":"الجمل مكتمل النمو","desc":"يعتمد على نفسه ويصبح قادرًا على التكاثر."}]};
const questions=[{"q":"أين تضع أنثى الضفدع بيوضها؟","options":["في الرمل","في الماء","على الأشجار"],"answer":1,"why":"تضع أنثى الضفدع بيوضها في الماء."},{"q":"كيف يتنفس أبو ذنيبة؟","options":["بالخياشيم","بالرئتين فقط","بالأنف مثل الجمل"],"answer":0,"why":"يتنفس أبو ذنيبة بالخياشيم في الماء."},{"q":"ما الترتيب الصحيح لنمو الضفدع؟","options":["ضفدع صغير، بيضة، أبو ذنيبة","أبو ذنيبة، بيضة، ضفدع","بيضة، أبو ذنيبة، ضفدع صغير، ضفدع مكتمل النمو"],"answer":2,"why":"تبدأ حياة الضفدع من البيضة، ثم أبو ذنيبة، ثم الضفدع الصغير، ثم مكتمل النمو."},{"q":"إلى أي مجموعة ينتمي الجمل؟","options":["الثدييات","البرمائيات","الأسماك"],"answer":0,"why":"الجمل من الثدييات؛ تلد الأنثى صغيرها وترضعه."},{"q":"ماذا يتعلم الجمل الصغير قبل أن يتكاثر؟","options":["وضع البيوض","التنفس بالخياشيم","الاعتماد على نفسه"],"answer":2,"why":"يتعلم الجمل الصغير الاعتماد على نفسه، ويتكاثر بعد اكتمال نموه."},{"q":"أي الحيوانين يمر بالتحوّل؟","options":["الجمل","الضفدع","كلاهما"],"answer":1,"why":"يتغيّر شكل الضفدع بوضوح في أثناء نموه؛ وتسمى هذه العملية التحوّل."}];
const $=id=>document.getElementById(id);
const selected={frog:0,camel:0};

function playRecording(){
 $('lesson-video').src='https://www.youtube-nocookie.com/embed/9vFJwm_g8Fs?autoplay=1&playsinline=1&rel=0';
 $('lesson-video').hidden=false;$('play-recording').hidden=true;$('stop-recording').hidden=false;
}
function stopRecording(){
 $('lesson-video').removeAttribute('src');$('lesson-video').hidden=true;
 $('play-recording').hidden=false;$('stop-recording').hidden=true;
}
$('play-recording').addEventListener('click',playRecording);
$('stop-recording').addEventListener('click',stopRecording);
document.querySelectorAll('.stage').forEach(button=>button.addEventListener('click',()=>{
 const animal=button.dataset.animal,index=Number(button.dataset.stage);selected[animal]=index;
 document.querySelectorAll('[data-animal="'+animal+'"]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const item=stages[animal][index],detail=$(animal+'-detail');detail.querySelector('h4').textContent=item.title;detail.querySelector('p').textContent=item.desc;
}));
let current=0,score=0,locked=false,answers=[],finished=false;
function startQuiz(){stopRecording();current=0;score=0;locked=false;finished=false;answers=[];$('quiz-welcome').hidden=true;$('quiz-result').hidden=true;$('quiz-play').hidden=false;document.querySelectorAll('.confetti').forEach(e=>e.remove());renderQuestion()}
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
 $('next-question').textContent=current===questions.length-1?'شاهد النتيجة ':'السؤال التالي ←';$('next-question').hidden=false;

}
function nextQuestion(){if(!locked||finished)return;if(current===questions.length-1){showResult();return}current++;renderQuestion()}
function showResult(){
 finished=true;stopRecording();$('quiz-play').hidden=true;$('quiz-result').hidden=false;$('final-score').textContent=score.toLocaleString('ar-SA');
 $('result-title').textContent=score===6?'مستكشف متميز!':score>=4?'اكتشاف رائع!':'كل محاولة تزيد معرفتك!';
 $('result-message').textContent=score===6?'أجبت عن جميع الأسئلة إجابة صحيحة. أحسنت!':'أجبت عن '+score.toLocaleString('ar-SA')+' أسئلة إجابة صحيحة. راجع الإجابات ثم حاول من جديد.';
 $('review').replaceChildren();
 questions.forEach((q,i)=>{const d=document.createElement('div');d.className='review-item';const title=document.createElement('strong');title.textContent=(answers[i]===q.answer?'✓ ':'○ ')+q.q;const detail=document.createElement('span');detail.textContent='إجابتك: '+q.options[answers[i]]+' · الإجابة الصحيحة: '+q.options[q.answer];d.append(title,detail);$('review').append(d)});
 if(score>=4){celebrate()}
 $('quiz-result').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
}
function celebrate(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<35;i++){const piece=document.createElement('i');piece.className='confetti';piece.style.left=Math.random()*100+'%';piece.style.background=['#d9af64','#76ab68','#ad91bd','#73b6af'][i%4];piece.style.animationDelay=Math.random()*.6+'s';document.body.append(piece);setTimeout(()=>piece.remove(),3800)}}
$('start-quiz').addEventListener('click',startQuiz);$('restart-quiz').addEventListener('click',startQuiz);$('next-question').addEventListener('click',nextQuestion);
$('print-result').addEventListener('click',()=>{document.body.classList.add('printing-result');window.print();document.body.classList.remove('printing-result')});
window.addEventListener('pagehide',stopRecording);

(function(){
  "use strict";

  /* ---------- 1. デモ施設データ（架空） ---------- */
  var CATS = {
    SNOW:  "雪遊び",
    RIDE:  "乗り物・スリル",
    VIEW:  "景色・写真",
    CRAFT: "ものづくり・食体験",
    ONSEN: "温泉・休息"
  };

  var ACTS = [
    { id:"tube", name:"スノーチュービング広場", cat:"SNOW",
      loc:"ベースエリア キッズパーク内", expMin:30, moveMin:15,
      unitType:"person", unitLabel:"1回券（1名）", price:800,
      ageNote:"3歳以上（未就学児は保護者同伴）",
      cond:"小学生未満は保護者の同伴が必要です。積雪状況により内容を変更する場合があります（デモ設定）。",
      belongings:"防水手袋・長靴（レンタルあり）",
      reception:"ベースセンター1階 チケットカウンター" },
    { id:"kidspark", name:"キッズスノーパーク（そり広場）", cat:"SNOW",
      loc:"ベースエリア横 そり専用ゲレンデ", expMin:40, moveMin:10,
      unitType:"person", unitLabel:"入場券（1名）", price:500,
      ageNote:"年齢制限なし（未就学児は保護者同伴）",
      cond:"そりの持ち込み可。レンタルそりあり。",
      belongings:"防寒着・手袋",
      reception:"そり広場入口 受付テント" },
    { id:"snowmobile", name:"スノーモービル体験走行", cat:"RIDE",
      loc:"北エリア 専用コース", expMin:20, moveMin:20,
      unitType:"unit", unitLabel:"1台（大人1名運転・体験走行）", price:4500,
      ageNote:"運転者16歳以上、同乗者4歳以上",
      cond:"運転前に施設の簡易講習（約10分・所要時間に含む）の受講が必須です。",
      belongings:"動きやすい服装。眼鏡等の落下物は外してください。",
      reception:"北エリア案内所" },
    { id:"snowraft", name:"雪上そり牽引ツアー", cat:"RIDE",
      loc:"中央ゲレンデ脇 専用コース", expMin:15, moveMin:15,
      unitType:"unit", unitLabel:"1艇（1〜2名）", price:3000,
      ageNote:"5歳以上",
      cond:"視界不良時は運休の場合があります（デモ設定）。",
      belongings:"帽子・ゴーグル推奨",
      reception:"中央ゲレンデ 受付小屋" },
    { id:"gondola", name:"山頂展望ゴンドラ&フォトスポット", cat:"VIEW",
      loc:"山頂エリア", expMin:40, moveMin:20,
      unitType:"person", unitLabel:"往復券（大人1名）", price:1800,
      ageNote:"小学生は半額（料金単位は維持）",
      cond:"強風時は運休の場合があります（デモ設定）。",
      belongings:"防寒着必須（山頂は麓より体感-5℃目安）",
      reception:"ゴンドラ山麓駅" },
    { id:"lightwalk", name:"雪原フォトスポット散策", cat:"VIEW",
      loc:"ベースエリア特設会場", expMin:20, moveMin:10,
      unitType:"person", unitLabel:"入場無料", price:0,
      ageNote:"年齢制限なし",
      cond:"時間帯により混雑する場合があります（デモ設定）。",
      belongings:"防寒着",
      reception:"特設会場入口" },
    { id:"woodcraft", name:"木工クラフト体験（キーホルダー作り）", cat:"CRAFT",
      loc:"クラフトハウス", expMin:45, moveMin:10,
      unitType:"person", unitLabel:"1名分材料費", price:1500,
      ageNote:"5歳以上推奨（未就学児は保護者同伴）",
      cond:"汚れてもよい服装を推奨します。",
      belongings:"特になし（エプロン貸出あり）",
      reception:"クラフトハウス受付" },
    { id:"fondue", name:"高原チーズフォンデュランチ", cat:"CRAFT",
      loc:"レストラン ゆきみ亭", expMin:50, moveMin:10,
      unitType:"person", unitLabel:"1名分（セットメニュー）", price:2200,
      ageNote:"子どもメニューは別料金（料金単位は維持）",
      cond:"混雑時は提供までお時間をいただく場合があります（デモ設定）。",
      belongings:"特になし",
      reception:"レストラン ゆきみ亭 入口" },
    { id:"onsen", name:"展望露天風呂", cat:"ONSEN",
      loc:"温泉棟3階", expMin:50, moveMin:15,
      unitType:"person", unitLabel:"入浴券（大人1名）", price:1200,
      ageNote:"小学生半額・未就学児無料（料金単位は維持）",
      cond:"タオル持参、または受付でレンタル・購入が可能です。",
      belongings:"タオル（レンタルあり）",
      reception:"温泉棟 受付" },
    { id:"footbath", name:"足湯ラウンジ&休憩", cat:"ONSEN",
      loc:"ベースセンター2階", expMin:25, moveMin:5,
      unitType:"person", unitLabel:"利用無料（ドリンク別売）", price:0,
      ageNote:"年齢制限なし",
      cond:"混雑時は利用時間の調整をお願いする場合があります（デモ設定）。",
      belongings:"タオル（レンタルあり）",
      reception:"ベースセンター2階 ラウンジ受付" }
  ];

  /* ---------- 2. 質問定義 ---------- */
  var Q1 = ["自分だけ","家族・グループ全員","一部のメンバー"];
  var Q2 = ["滑らない","少し滑って、ほかの体験もしたい","滑る合間に楽しみたい","まだ決めていない"];
  var Q3 = ["１時間以内","２時間程度","半日","特に決めていない"];
  var Q4 = ["雪遊び","乗り物・スリル","景色・写真","ものづくり・食体験","温泉・休息","おまかせ"];
  var TIME_BUDGET = { "１時間以内":60, "２時間程度":120, "半日":240, "特に決めていない":null };
  var CAT_BY_LABEL = { "雪遊び":"SNOW","乗り物・スリル":"RIDE","景色・写真":"VIEW","ものづくり・食体験":"CRAFT","温泉・休息":"ONSEN" };

  /* ---------- 3. 状態 ---------- */
  var state = {
    step: "start",          // start | q1 | q2 | q3 | q4 | proposal | editPick | final
    answers: { who:null, ski:null, time:null, wants:[] },
    plans: [],
    finalPlan: null,
    editMode:false          // true while re-answering a single item from "条件を変える"
  };

  var thread, composer;

  function el(tag, cls, html){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html!==undefined) e.innerHTML = html;
    return e;
  }
  function scrollBottom(){ requestAnimationFrame(function(){ thread.scrollTop = thread.scrollHeight; }); }

  function addBot(text, isSystem){
    var row = el("div","row bot");
    row.appendChild(el("div","bot-avatar","雪"));
    row.appendChild(el("div", isSystem ? "bubble system":"bubble bot", escapeHtml(text)));
    thread.appendChild(row);
    scrollBottom();
  }
  function addUser(text){
    var row = el("div","row user");
    row.appendChild(el("div","bubble user", escapeHtml(text)));
    thread.appendChild(row);
    scrollBottom();
  }
  function escapeHtml(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function clearComposer(){ composer.innerHTML=""; }

  /* ---------- 4. コンポーザー（質問への回答UI） ---------- */
  function renderComposer(){
    clearComposer();
    if (state.step==="start"){
      var row = el("div","chip-row");
      var b = el("button","chip primary wide","今日の過ごし方を探す");
      b.type="button";
      b.onclick=function(){ startFlow(); };
      row.appendChild(b);
      composer.appendChild(row);
    } else if (state.step==="q1"){ renderSingleChoice("誰の過ごし方を探しますか？", Q1, onAnswerQ1); }
    else if (state.step==="q2"){ renderSingleChoice("対象の方は今日どう過ごす予定ですか？", Q2, onAnswerQ2); }
    else if (state.step==="q3"){ renderSingleChoice("使える時間はどのくらいですか？", Q3, onAnswerQ3); }
    else if (state.step==="q4"){ renderQ4(); }
    else if (state.step==="proposal"){ renderProposalComposer(); }
    else if (state.step==="editPick"){ renderEditPick(); }
    else if (state.step==="final"){ renderFinalComposer(); }
  }

  function renderSingleChoice(label, options, handler){
    var wrap = el("div");
    wrap.appendChild(el("div","q-label",label));
    var row = el("div","chip-row");
    options.forEach(function(opt){
      var b = el("button","chip",opt);
      b.type="button";
      b.onclick=function(){ handler(opt); };
      row.appendChild(b);
    });
    wrap.appendChild(row);
    composer.appendChild(wrap);
  }

  var q4Selected = [];
  function renderQ4(){
    clearComposer();
    var wrap = el("div");
    wrap.appendChild(el("div","q-label","楽しみたいことを選んでください（最大2つ／「おまかせ」は単独）"));
    var row = el("div","chip-row");
    Q4.forEach(function(opt){
      var b = el("button","chip",opt);
      b.type="button";
      if (q4Selected.indexOf(opt)>=0) b.className="chip selected";
      b.onclick=function(){ toggleQ4(opt); };
      row.appendChild(b);
    });
    wrap.appendChild(row);
    var row2 = el("div","chip-row");
    var confirm = el("button","chip primary wide","この内容で進む");
    confirm.type="button";
    confirm.disabled = q4Selected.length===0;
    confirm.onclick=function(){ if (q4Selected.length>0) onAnswerQ4(); };
    row2.appendChild(confirm);
    wrap.appendChild(row2);
    composer.appendChild(wrap);
  }
  function toggleQ4(opt){
    if (opt==="おまかせ"){
      q4Selected = (q4Selected.indexOf("おまかせ")>=0) ? [] : ["おまかせ"];
    } else {
      var idx = q4Selected.indexOf(opt);
      if (idx>=0){ q4Selected.splice(idx,1); }
      else {
        q4Selected = q4Selected.filter(function(v){ return v!=="おまかせ"; });
        if (q4Selected.length<2) q4Selected.push(opt);
      }
    }
    renderQ4();
  }

  function renderProposalComposer(){
    var row = el("div","chip-row");
    var b1 = el("button","chip","条件を変える");
    b1.type="button"; b1.onclick=function(){ goEditPick(); };
    var b2 = el("button","chip ghost","はじめから試す");
    b2.type="button"; b2.onclick=function(){ resetAll(); };
    row.appendChild(b1); row.appendChild(b2);
    composer.appendChild(row);
  }

  function renderEditPick(){
    var wrap = el("div");
    wrap.appendChild(el("div","q-label","変更したい項目を選んでください（他の回答は保持されます）"));
    var row = el("div","chip-row");
    var items = [
      { label:"①誰のプラン："+state.answers.who, action:function(){ enterEdit("q1"); } },
      { label:"②滑走予定："+state.answers.ski, action:function(){ enterEdit("q2"); } },
      { label:"③使える時間："+state.answers.time, action:function(){ enterEdit("q3"); } },
      { label:"④楽しみたいこと："+state.answers.wants.join("・"), action:function(){ enterEdit("q4"); } }
    ];
    items.forEach(function(it){
      var b = el("button","chip wide",it.label);
      b.type="button";
      b.onclick=it.action;
      row.appendChild(b);
    });
    wrap.appendChild(row);
    var row2 = el("div","chip-row");
    var back = el("button","chip ghost","戻る（変更しない）");
    back.type="button";
    back.onclick=function(){ state.step="proposal"; addBot("変更をキャンセルしました。"); renderComposer(); };
    row2.appendChild(back);
    wrap.appendChild(row2);
    composer.appendChild(wrap);
  }

  function renderFinalComposer(){
    var row = el("div","chip-row");
    var b1 = el("button","chip","他の案を見る");
    b1.type="button"; b1.onclick=function(){ state.step="proposal"; addBot("これまでの回答をもとに、もう一度候補を表示しますね。"); showProposalCards(); renderComposer(); };
    var b2 = el("button","chip ghost","はじめから試す");
    b2.type="button"; b2.onclick=function(){ resetAll(); };
    row.appendChild(b1); row.appendChild(b2);
    composer.appendChild(row);
  }

  /* ---------- 5. フロー制御 ---------- */
  function startFlow(){
    addUser("今日の過ごし方を探す");
    addBot("ようこそ、ゆきみ高原スキー場へ。これは架空施設によるデモです。４つの質問にお答えいただくと、あなたに合う過ごし方をご提案します。予約・決済は発生しません。");
    state.step="q1";
    renderComposer();
  }

  function onAnswerQ1(opt){
    addUser(opt);
    state.answers.who = opt;
    if (opt==="一部のメンバー"){
      addBot("以降の質問は、そのメンバーの過ごし方についてお答えください。人数や年齢などの個人情報はお伺いしません。", true);
    }
    if (state.editMode){ state.editMode=false; goProposal(); return; }
    state.step="q2";
    addBot("対象の方は、今日はどのように過ごす予定ですか？");
    renderComposer();
  }
  function onAnswerQ2(opt){
    addUser(opt);
    state.answers.ski = opt;
    if (state.editMode){ state.editMode=false; goProposal(); return; }
    state.step="q3";
    addBot("スキー以外の体験に、どのくらい時間を使えますか？");
    renderComposer();
  }
  function onAnswerQ3(opt){
    addUser(opt);
    state.answers.time = opt;
    if (state.editMode){ state.editMode=false; goProposal(); return; }
    state.step="q4";
    q4Selected = [];
    addBot("どんなことを楽しみたいですか？（最大2つ／「おまかせ」は単独で選べます）");
    renderComposer();
  }
  function onAnswerQ4(){
    addUser(q4Selected.join("・"));
    state.answers.wants = q4Selected.slice();
    state.editMode = false;
    goProposal();
  }

  function enterEdit(which){
    state.step = which;
    state.editMode = true;
    if (which==="q4") q4Selected = state.answers.wants.slice();
    var label = which==="q1"?"誰のプラン":which==="q2"?"今日の滑走予定":which==="q3"?"使える時間":"楽しみたいこと";
    addBot(label+"を選び直してください。他の回答は保持します。", true);
    renderComposer();
  }

  function goEditPick(){
    state.step="editPick";
    addBot("どの項目を変更しますか？");
    renderComposer();
  }

  function resetAll(){
    state = { step:"start", answers:{who:null,ski:null,time:null,wants:[]}, plans:[], finalPlan:null, editMode:false };
    q4Selected = [];
    thread.innerHTML="";
    addBot("最初からやり直します。ようこそ、ゆきみ高原スキー場へ。これは架空施設によるデモです。「今日の過ごし方を探す」から始めてください。");
    renderComposer();
  }

  /* ---------- 6. 提案ロジック ---------- */
  function combinations(arr, k){
    var res = [];
    function rec(start, combo){
      if (combo.length===k){ res.push(combo.slice()); return; }
      for (var i=start;i<arr.length;i++){
        combo.push(arr[i]);
        rec(i+1, combo);
        combo.pop();
      }
    }
    rec(0, []);
    return res;
  }

  function maxComboSize(ski, budget){
    if (ski==="滑る合間に楽しみたい") return 1;
    if (budget===null) return 3;
    if (budget<=60) return 1;
    if (budget<=120) return 2;
    return 3;
  }

  function buildPlans(answers){
    var wants = answers.wants;
    var omakase = wants.indexOf("おまかせ")>=0;
    var pool = omakase ? ACTS.slice() : ACTS.filter(function(a){
      return wants.some(function(w){ return CAT_BY_LABEL[w]===a.cat; });
    });
    var budget = TIME_BUDGET[answers.time];
    var maxSize = maxComboSize(answers.ski, budget);

    var all = [];
    for (var size=1; size<=Math.min(maxSize,pool.length); size++){
      combinations(pool, size).forEach(function(combo){
        var total = combo.reduce(function(s,a){ return s+a.expMin+a.moveMin; }, 0);
        if (budget!==null && total>budget) return;
        var cats = combo.map(function(a){ return a.cat; });
        var uniqCats = cats.filter(function(c,i){ return cats.indexOf(c)===i; });
        var catMatch = omakase ? 1 : uniqCats.filter(function(c){
          return wants.some(function(w){ return CAT_BY_LABEL[w]===c; });
        }).length;
        var timeUtil = budget!==null
          ? (1 - Math.abs(budget-total)/budget)
          : (1 - Math.min(1, Math.abs(90-total)/150));
        var sizeBonus = 0;
        if (answers.ski==="滑らない" || answers.time==="半日") sizeBonus = combo.length*2;
        if (answers.ski==="滑る合間に楽しみたい") sizeBonus += (60-Math.min(total,60))/10;
        var score = catMatch*100 + timeUtil*10 + sizeBonus;
        all.push({ activities:combo, total:total, catSet:uniqCats.sort().join(","), score:score,
          key:combo.map(function(a){return a.id;}).sort().join("+") });
      });
    }
    all.sort(function(a,b){
      if (b.score!==a.score) return b.score-a.score;
      if (a.total!==b.total) return a.total-b.total;
      return a.key.localeCompare(b.key);
    });

    var picked = [];
    var usedCatSets = {};
    var usedKeys = {};
    all.forEach(function(c){
      if (picked.length>=3) return;
      if (!usedCatSets[c.catSet] && !usedKeys[c.key]){
        picked.push(c); usedCatSets[c.catSet]=true; usedKeys[c.key]=true;
      }
    });
    if (picked.length<3){
      all.forEach(function(c){
        if (picked.length>=3) return;
        if (!usedKeys[c.key]){ picked.push(c); usedKeys[c.key]=true; }
      });
    }

    return picked.map(function(c, idx){ return toPlan(c, idx===0, answers); });
  }

  function catLabelOf(catKey){ return CATS[catKey]; }

  function toPlan(combo, recommended, answers){
    var acts = combo.activities;
    var name, tagline;
    if (acts.length===1){
      name = acts[0].name;
      tagline = catLabelOf(acts[0].cat)+"を楽しむプラン";
    } else {
      name = acts.map(function(a){return a.name;}).join(" + ");
      var cats = acts.map(function(a){return a.cat;});
      var uniq = cats.filter(function(c,i){return cats.indexOf(c)===i;});
      tagline = uniq.map(catLabelOf).join("×")+"プラン";
    }
    return {
      key: combo.key,
      recommended: recommended,
      name: name,
      tagline: tagline,
      total: combo.total,
      activities: acts,
      reason: buildReason(acts, answers, combo.total)
    };
  }

  function buildReason(acts, answers, total){
    var lines = [];
    if (answers.who==="一部のメンバー") lines.push("指定いただいた一部のメンバー向けの内容です。");
    else if (answers.who==="家族・グループ全員") lines.push("グループ全員で楽しめる内容です。");
    else lines.push("お一人でゆったり楽しめる内容です。");

    var skiMap = {
      "滑らない":"スキーをしない前提で、滑走を必要としない体験を選びました。",
      "少し滑って、ほかの体験もしたい":"少し滑ってからでも楽しめる、無理のない内容です。",
      "滑る合間に楽しみたい":"滑走の合間でも楽しめるよう、短時間・移動少なめの体験を選びました。",
      "まだ決めていない":"滑走予定が未定でも楽しめる内容です。"
    };
    lines.push(skiMap[answers.ski]);

    var budget = TIME_BUDGET[answers.time];
    lines.push(budget!==null
      ? "受付・移動を含めて約"+total+"分（設定枠："+answers.time+"）に収まります。"
      : "受付・移動を含めて約"+total+"分の内容です。時間はまだ決まっていなくても大丈夫です。");

    if (answers.wants.indexOf("おまかせ")>=0){
      lines.push("「おまかせ」のため、過ごし方が異なる体験を組み合わせてご提案しています。");
    } else {
      lines.push("「"+answers.wants.join("・")+"」のご希望に合わせた体験です。");
    }
    return lines.join(" ");
  }

  function goProposal(){
    state.step="proposal";
    state.plans = buildPlans(state.answers);
    var summary = "承知しました。\n"
      + "対象："+state.answers.who+" / 滑走予定："+state.answers.ski+"\n"
      + "使える時間："+state.answers.time+" / 楽しみたいこと："+state.answers.wants.join("・");
    addBot(summary);
    if (state.plans.length===0){
      addBot("申し訳ございません、設定条件に合う過ごし方が見つかりませんでした。使える時間を延ばすか、楽しみたいことを変えて、もう一度お試しください。", true);
    } else if (state.plans.length<3){
      addBot("条件に合う候補は"+state.plans.length+"件でした。無理に3件そろえず、成立する案のみご案内します。", true);
      showProposalCards();
    } else {
      addBot("おすすめ1案と、代替2案をご用意しました。気になるプランを選んで詳細を確認してください。");
      showProposalCards();
    }
    renderComposer();
  }

  function showProposalCards(){
    state.plans.forEach(function(plan){
      var row = el("div","row bot");
      row.appendChild(el("div","bot-avatar","雪"));
      var card = el("div","plancard");
      card.appendChild(el("div", plan.recommended?"badge":"badge alt", plan.recommended?"おすすめ1案":"代替案"));
      card.appendChild(el("div","pname", escapeHtml(plan.name)));
      card.appendChild(el("div","ptag", escapeHtml(plan.tagline)));
      var meta = el("div","pmeta");
      meta.innerHTML = "<span>所要 約"+plan.total+"分（受付・移動込み）</span>";
      card.appendChild(meta);
      card.appendChild(el("div","preason", escapeHtml(plan.reason)));
      var btn = el("button","pbtn","詳しく見る");
      btn.type="button";
      btn.onclick=function(){ openDetail(plan); };
      card.appendChild(btn);
      row.appendChild(card);
      thread.appendChild(row);
    });
    scrollBottom();
  }

  /* ---------- 7. 詳細シート ---------- */
  var sheetOverlay, sheetTitle, sheetTag, sheetBody, sheetFoot;

  function openDetail(plan){
    sheetTitle.textContent = plan.name;
    sheetTag.textContent = plan.tagline+" ・ 所要 約"+plan.total+"分（受付・移動込み）";
    sheetBody.innerHTML = "";

    // 体験の順番
    sheetBody.appendChild(sectionTitle("体験の順番"));
    var steps = el("div","steps");
    var elapsed = 0;
    plan.activities.forEach(function(a, i){
      elapsed += a.moveMin;
      var mv = el("div","movehint","受付・移動 約"+a.moveMin+"分 → 受付から約"+elapsed+"分後に開始");
      steps.appendChild(mv);
      var s = el("div","step");
      s.appendChild(el("div","stepnum",String(i+1)));
      var right = el("div");
      right.appendChild(el("div","sname", escapeHtml(a.name)+"（"+catLabelOf(a.cat)+"）"));
      right.appendChild(el("div","smeta","体験時間 約"+a.expMin+"分　場所："+a.loc));
      s.appendChild(right);
      steps.appendChild(s);
      elapsed += a.expMin;
    });
    sheetBody.appendChild(steps);

    // 料金の内訳
    sheetBody.appendChild(sectionTitle("料金の内訳"));
    var costWrap = el("div");
    var allPerson = true;
    var sum = 0;
    plan.activities.forEach(function(a){
      var line = el("div","costline");
      var left = el("div");
      left.appendChild(el("div","cname", escapeHtml(a.name)));
      left.appendChild(el("div","cunit", escapeHtml(a.unitLabel)+"／対象："+escapeHtml(a.ageNote)));
      line.appendChild(left);
      line.appendChild(el("div","camt", a.price>0 ? ("¥"+a.price.toLocaleString()) : "無料"));
      costWrap.appendChild(line);
      if (a.unitType!=="person") allPerson=false;
      sum += a.price;
    });
    sheetBody.appendChild(costWrap);
    if (allPerson){
      var tot = el("div","costtotal");
      tot.innerHTML = "<span>大人1名が利用した場合の参考合計</span><span>&yen;"+sum.toLocaleString()+"</span>";
      sheetBody.appendChild(tot);
      sheetBody.appendChild(el("div","costnote","※上記は各体験を大人1名として利用した場合の参考合計です。実際の金額は人数・年齢・共通券の有無により異なります。"));
    } else {
      sheetBody.appendChild(el("div","costnote","※このプランは料金の課金単位（1名あたり／1台・1艇あたり等）が揃わないため、合計は表示していません。各体験の内訳をご確認ください。"));
    }

    // 参加条件・準備
    sheetBody.appendChild(sectionTitle("参加条件・準備"));
    var condWrap = el("div");
    plan.activities.forEach(function(a){
      var c = el("div","conditem");
      c.appendChild(el("div","cname", escapeHtml(a.name)));
      c.appendChild(el("div","cbody","対象年齢：" + escapeHtml(a.ageNote) + "／持ち物：" + escapeHtml(a.belongings) + "\n" + escapeHtml(a.cond)));
      condWrap.appendChild(c);
    });
    sheetBody.appendChild(condWrap);
    sheetBody.appendChild(el("div","costnote","※年齢・身長などは未入力のため、「全員参加できる」とは断定していません。上記条件をご確認のうえご判断ください。"));

    // 場所・受付方法
    sheetBody.appendChild(sectionTitle("場所・受付方法"));
    var locWrap = el("div");
    plan.activities.forEach(function(a, i){
      var l = el("div","locitem");
      l.appendChild(el("div","stepnum",String(i+1)));
      var r = el("div");
      r.appendChild(el("div","lname", escapeHtml(a.name)));
      r.appendChild(el("div","lplace","受付：" + escapeHtml(a.reception) + "（" + escapeHtml(a.loc) + "）"));
      l.appendChild(r);
      locWrap.appendChild(l);
    });
    sheetBody.appendChild(locWrap);
    sheetBody.appendChild(el("div","costnote","※デモのため地図表示はありません。実装時は施設マップと現在地からの案内を想定しています。"));

    sheetFoot.innerHTML="";
    var back = el("button","chip","閉じる");
    back.type="button"; back.onclick=closeDetail;
    var choose = el("button","chip primary","このプランにする");
    choose.type="button"; choose.onclick=function(){ chooseFinal(plan); };
    sheetFoot.appendChild(back);
    sheetFoot.appendChild(choose);

    sheetOverlay.classList.add("open");
  }
  function sectionTitle(t){ return el("div","sec-title", t); }
  function closeDetail(){ sheetOverlay.classList.remove("open"); }

  function chooseFinal(plan){
    closeDetail();
    state.finalPlan = plan;
    state.step="final";
    addUser("「"+plan.name+"」にする");
    var first = plan.activities[0];
    var belongings = plan.activities.map(function(a){return a.belongings;})
      .filter(function(v,i,arr){ return v!=="特になし" && arr.indexOf(v)===i; }).join("／");
    var msg = "「"+plan.name+"」で承知しました。\n\n"
      + "■最初に向かう場所\n"+first.reception+"（"+first.loc+"）\n\n"
      + "■必要な準備\n"+(belongings||"特にありません")+"\n\n"
      + "このデモでは予約は成立していません。実際の施設では、この受付案内をもとにスタッフへお声がけください。";
    addBot(msg);
    renderComposer();
  }

  /* ---------- 8. 起動 ---------- */
  function boot(){
    thread = document.getElementById("thread");
    composer = document.getElementById("composer");
    sheetOverlay = document.getElementById("sheetOverlay");
    sheetTitle = document.getElementById("sheetTitle");
    sheetTag = document.getElementById("sheetTag");
    sheetBody = document.getElementById("sheetBody");
    sheetFoot = document.getElementById("sheetFoot");
    document.getElementById("sheetClose").onclick = closeDetail;
    sheetOverlay.addEventListener("click", function(e){ if (e.target===sheetOverlay) closeDetail(); });
    document.getElementById("resetBtn").onclick = function(){
      if (state.step==="start") return;
      resetAll();
    };

    addBot("こんにちは！ゆきみ高原スキー場です。");
    renderComposer();
  }

  /* LINEミニアプリ（LIFF）内で開かれた場合は liff.init を待ってから起動する。
     LIFF SDKが読み込めない/未設定の場合は通常のWebページとしてそのまま起動する
     （PC等でのWeb動作確認を引き続き妨げないため）。*/
  function start(){
    var liffId = window.LIFF_ID;
    if (typeof liff === "undefined" || !liffId || liffId.indexOf("XXXX")>=0){
      window.__liffReady = false;
      boot();
      return;
    }
    liff.init({ liffId: liffId }).then(function(){
      window.__liffReady = true;
      boot();
    }).catch(function(err){
      console.error("LIFF init failed, falling back to plain web mode.", err);
      window.__liffReady = false;
      boot();
    });
  }

  if (document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

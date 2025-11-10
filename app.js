/* ========= Config ========= */
const CONFIG = {
  hotel: {
    redirect: "/iletisim",
    utm: "utm_source=widget&utm_medium=hotel",
    whatsapp: "905449137827", // WhatsApp'a gider
  },
  transfer: {
    redirect: "/iletisim",
    utm: "utm_source=widget&utm_medium=transfer",
    whatsapp: "905449137827", // istersen buraya da numara gir
  },
};

/* ========= URL override (?redirect=/baska-sayfa) ========= */
const qp = new URLSearchParams(location.search);
if (qp.get("redirect")) {
  CONFIG.hotel.redirect = qp.get("redirect");
  CONFIG.transfer.redirect = qp.get("redirect");
}

/* ========= Tabs ========= */
const tabBtns = document.querySelectorAll(".dm-tab");
const hotelForm = document.getElementById("hotelForm");
const transferForm = document.getElementById("transferForm");
let activeTab = "hotel";

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    if (activeTab === "hotel") {
      hotelForm.classList.remove("dm-hidden");
      transferForm.classList.add("dm-hidden");
    } else {
      transferForm.classList.remove("dm-hidden");
      hotelForm.classList.add("dm-hidden");
    }
  });
});

/* ========= Datepickr ========= */
const fpHotel = flatpickr("#hotelDates", {
  mode: "range",
  dateFormat: "d.m.Y",
  locale: flatpickr.l10ns.tr,
  minDate: "today",
  defaultDate: [new Date(), new Date(Date.now() + 86400000)],
});
const fpTransferDate = flatpickr("#transferDate", {
  dateFormat: "d.m.Y",
  locale: flatpickr.l10ns.tr,
  minDate: "today",
  defaultDate: new Date(),
});
const fpReturnDate = flatpickr("#returnDate", {
  dateFormat: "d.m.Y",
  locale: flatpickr.l10ns.tr,
  minDate: new Date(Date.now() + 86400000),
});
document.getElementById("isReturn").addEventListener("change", (e) => {
  const ret = document.getElementById("returnDate");
  if (e.target.checked) ret.classList.remove("dm-hidden");
  else {
    ret.classList.add("dm-hidden");
    ret.value = "";
  }
});

/* ========= Autocomplete (TR airports + bus) ========= */
const TR_LOCATIONS = [
  {
    code: "IST",
    name: "İstanbul Havalimanı",
    city: "İstanbul",
    type: "airport",
  },
  {
    code: "SAW",
    name: "Sabiha Gökçen Havalimanı",
    city: "İstanbul",
    type: "airport",
  },
  { code: "AYT", name: "Antalya Havalimanı", city: "Antalya", type: "airport" },
  {
    code: "ADB",
    name: "İzmir Adnan Menderes Havalimanı",
    city: "İzmir",
    type: "airport",
  },
  {
    code: "ESB",
    name: "Ankara Esenboğa Havalimanı",
    city: "Ankara",
    type: "airport",
  },
  {
    code: "BJV",
    name: "Milas-Bodrum Havalimanı",
    city: "Muğla",
    type: "airport",
  },
  { code: "DLM", name: "Dalaman Havalimanı", city: "Muğla", type: "airport" },
  { code: "TZX", name: "Trabzon Havalimanı", city: "Trabzon", type: "airport" },
  {
    code: "ADA",
    name: "Adana Şakirpaşa Havalimanı",
    city: "Adana",
    type: "airport",
  },
  {
    code: "ASR",
    name: "Kayseri Erkilet Havalimanı",
    city: "Kayseri",
    type: "airport",
  },
  {
    code: "GZP",
    name: "Gazipaşa-Alanya Havalimanı",
    city: "Alanya",
    type: "airport",
  },
  {
    code: "GNY",
    name: "Şanlıurfa GAP Havalimanı",
    city: "Şanlıurfa",
    type: "airport",
  },
  { code: "ERZ", name: "Erzurum Havalimanı", city: "Erzurum", type: "airport" },
  {
    code: "DIY",
    name: "Diyarbakır Havalimanı",
    city: "Diyarbakır",
    type: "airport",
  },
  { code: "HTY", name: "Hatay Havalimanı", city: "Hatay", type: "airport" },
  { code: "OTOGAR-ANT", name: "Antalya Otogarı", city: "Antalya", type: "bus" },
  {
    code: "OTOGAR-IST",
    name: "Esenler Otogarı",
    city: "İstanbul",
    type: "bus",
  },
  {
    code: "OTOGAR-ANK",
    name: "AŞTİ (Ankara Şehirlerarası)",
    city: "Ankara",
    type: "bus",
  },
  {
    code: "OTOGAR-IZM",
    name: "İzmir Otogarı (İZOTAŞ)",
    city: "İzmir",
    type: "bus",
  },
  { code: "OTOGAR-BUR", name: "Bursa Otogarı", city: "Bursa", type: "bus" },
  { code: "OTOGAR-MRS", name: "Mersin Otogarı", city: "Mersin", type: "bus" },
  { code: "OTOGAR-ADA", name: "Adana Otogarı", city: "Adana", type: "bus" },
  {
    code: "OTOGAR-GZT",
    name: "Gaziantep Otogarı",
    city: "Gaziantep",
    type: "bus",
  },
  { code: "OTOGAR-TRB", name: "Trabzon Otogarı", city: "Trabzon", type: "bus" },
  { code: "OTOGAR-KYS", name: "Kayseri Otogarı", city: "Kayseri", type: "bus" },
];

const pickupInput = document.getElementById("pickup");
const pickupList = document.getElementById("acPickup");
const clearBtn = document.querySelector(".dm-clear");
let acIndex = -1;

pickupInput.addEventListener("input", onAcInput);
pickupInput.addEventListener("keydown", onAcKey);
document.addEventListener("click", (e) => {
  if (!pickupList.contains(e.target) && e.target !== pickupInput) hideAc();
});
clearBtn.addEventListener("click", () => {
  pickupInput.value = "";
  pickupInput.focus();
  hideAc();
  pickupInput.parentElement.classList.remove("has-value");
});

function onAcInput() {
  const q = normalize(pickupInput.value.trim());
  pickupInput.parentElement.classList.toggle(
    "has-value",
    pickupInput.value.length > 0
  );
  if (q.length < 2) {
    hideAc();
    return;
  }
  const results = TR_LOCATIONS.filter((it) => {
    const t = normalize(`${it.city} ${it.name} ${it.code}`);
    return t.includes(q);
  }).slice(0, 8);
  renderAc(results);
}
function renderAc(items) {
  pickupList.innerHTML = "";
  if (items.length === 0) {
    hideAc();
    return;
  }
  items.forEach((it, idx) => {
    const li = document.createElement("li");
    li.className = "dm-ac-item";
    li.setAttribute("role", "option");
    li.setAttribute("id", `ac-${idx}`);
    li.innerHTML = `
      <span>${it.city} ${
      it.type === "airport" ? "Havalimanı" : "Otogarı"
    }, TR<br>
        <small>${it.name}</small>
      </span>
      <span class="dm-type">${
        it.type === "airport" ? "airport" : "bus"
      }</span>`;
    li.addEventListener("click", () => selectAc(it));
    pickupList.appendChild(li);
  });
  pickupList.classList.add("show");
  acIndex = -1;
}
function onAcKey(e) {
  const items = [...pickupList.querySelectorAll(".dm-ac-item")];
  if (!pickupList.classList.contains("show")) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    acIndex = Math.min(items.length - 1, acIndex + 1);
    updateActive(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    acIndex = Math.max(0, acIndex - 1);
    updateActive(items);
  } else if (e.key === "Enter" && acIndex > -1) {
    e.preventDefault();
    items[acIndex].click();
  } else if (e.key === "Escape") hideAc();
}
function updateActive(items) {
  items.forEach((el, i) => el.setAttribute("aria-selected", i === acIndex));
  if (items[acIndex]) items[acIndex].scrollIntoView({ block: "nearest" });
}
function selectAc(it) {
  pickupInput.value = `${it.city} ${
    it.type === "airport" ? "Havalimanı" : "Otogarı"
  } (${it.code})`;
  hideAc();
  pickupInput.parentElement.classList.add("has-value");
}
function hideAc() {
  pickupList.classList.remove("show");
}
function normalize(s) {
  return s.toLowerCase().replaceAll("ı", "i").replaceAll("İ", "i");
}
function score(it, q) {
  const c = normalize(it.city),
    n = normalize(it.name),
    code = normalize(it.code);
  let s = 0;
  if (c.startsWith(q)) s += 3;
  if (n.startsWith(q)) s += 2;
  if (c.includes(q)) s += 1;
  if (n.includes(q)) s += 1;
  if (code.startsWith(q)) s += 2;
  return s;
}

function onAcInput() {
  const q = normalize(pickupInput.value.trim());
  const results = TR_LOCATIONS.filter((it) =>
    normalize(`${it.city} ${it.name} ${it.code}`).includes(q)
  )
    .sort((a, b) => score(b, q) - score(a, q))
    .slice(0, 8);
  renderAc(results);
}

/* ========= Submit: redirect / WhatsApp ========= */
hotelForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const hotel = document.getElementById("hotelName").value.trim();
  const sel = fpHotel.selectedDates;
  if (sel.length < 2) {
    alert("Lütfen giriş ve çıkış tarihlerini seçin.");
    return;
  }

  // UTM ve diğer bilgiler yine URL'de dursun (analitik için)
  const qs = new URLSearchParams({
    type: "hotel",
    hotel,
    checkin: toISO(sel[0]),
    checkout: toISO(sel[1]),
    rooms: document.getElementById("hotelRooms").value,
    guests: document.getElementById("hotelGuests").value,
    utm: CONFIG.hotel.utm,
  });

  // >>> Sadece şu kısa metni gönder <<<
  const textOverride = `Merhaba ${hotel} için bilgi almak istiyorum.`;

  go(CONFIG.hotel, qs, { textOverride });
});

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const from = document.getElementById("pickup").value.trim();
  const hotel = document.getElementById("transferHotel").value.trim();
  const isRet = document.getElementById("isReturn").checked;

  const qs = new URLSearchParams({
    type: "transfer",
    from,
    hotel,
    date: toISO(fpTransferDate.selectedDates[0] || new Date()),
    return: isRet
      ? toISO(fpReturnDate.selectedDates[0] || new Date(Date.now() + 86400000))
      : "",
    pax: document.getElementById("transferPax").value,
    utm: CONFIG.transfer.utm,
  });

  // >>> Transfer için kısa mesaj <<<
  const textOverride = `Merhaba, ${from} → ${hotel} transferi için bilgi almak istiyorum.`;

  go(CONFIG.transfer, qs, { textOverride });
});

function go(cfg, qs, msgObj) {
  if (cfg.whatsapp) {
    // textOverride varsa onu kullan; yoksa ayrıntılı listeye düş
    const text =
      msgObj?.textOverride ??
      Object.entries(msgObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
    const url = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(
      text
    )}`;
    openInNewTab(url);
  } else {
    const target = cfg.redirect.replace(/\/$/, "");
    const url = `${target}?${qs.toString()}`;
    openInNewTab(url);
  }
}

/* ========= Helpers ========= */
function openInNewTab(url) {
  const w = window.open(url, "_blank", "noopener");
  if (w) w.opener = null;
  else {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
function toISO(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

/* ========= Opsiyonel: “oda müsaitlik durumu” linki ========= */
document.getElementById("availabilityLink").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Burayı kendi sayfanıza yönlendirebilirsiniz.");
});

/* ========= Opsiyonel: Custom validity Türkçe ========= */
function setMsg(el, msg) {
  el.addEventListener("invalid", () => el.setCustomValidity(msg));
  el.addEventListener("input", () => el.setCustomValidity(""));
}
setMsg(document.getElementById("hotelName"), "Lütfen otelinizin ismini yazın.");
setMsg(
  document.getElementById("hotelDates"),
  "Lütfen giriş ve çıkış tarihlerini seçin."
);
setMsg(document.getElementById("pickup"), "Lütfen nereden alacağınızı yazın.");
setMsg(document.getElementById("transferHotel"), "Lütfen otel adını yazın.");

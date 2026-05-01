(function () {
  "use strict";

  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  var agentId = script && script.getAttribute("data-agent-id") || "";
  var widgetKey = script && script.getAttribute("data-widget-key") || "";
  var endpoint = "https://vefcgkgnpx.us-east-1.awsapprunner.com/widget/chat";
  var rootId = "mirrorean-one-widget-root";

  if (document.getElementById(rootId)) return;

  var conversationId = null;
  var isOpen = false;
  var isSending = false;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function addStyles() {
    var style = document.createElement("style");
    style.textContent =
      "#mirrorean-one-widget-root *{box-sizing:border-box}" +
      "#mo-chat-button{position:fixed;right:22px;bottom:22px;width:56px;height:56px;border:0;border-radius:50%;background:#111827;color:#fff;box-shadow:0 12px 32px rgba(17,24,39,.24);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2147483647;transition:transform .16s ease,box-shadow .16s ease}" +
      "#mo-chat-button:hover{transform:translateY(-1px);box-shadow:0 16px 38px rgba(17,24,39,.28)}" +
      "#mo-chat-button:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:3px}" +
      "#mo-chat-button svg{width:25px;height:25px}" +
      "#mo-chat-panel{position:fixed;right:22px;bottom:90px;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 112px);background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 22px 70px rgba(17,24,39,.22);display:none;flex-direction:column;overflow:hidden;z-index:2147483646;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827}" +
      "#mo-chat-panel.mo-open{display:flex}" +
      "#mo-chat-header{padding:14px 16px;background:#111827;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px}" +
      "#mo-chat-title{font-size:15px;font-weight:700;line-height:1.2}" +
      "#mo-chat-status{font-size:12px;color:#cbd5e1;margin-top:3px}" +
      "#mo-chat-close{width:32px;height:32px;border:0;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
      "#mo-chat-close svg{width:18px;height:18px}" +
      "#mo-chat-messages{flex:1;overflow-y:auto;background:#f8fafc;padding:16px;display:flex;flex-direction:column;gap:10px}" +
      ".mo-msg{max-width:84%;display:flex;flex-direction:column;gap:4px}" +
      ".mo-msg-user{align-self:flex-end}" +
      ".mo-msg-assistant{align-self:flex-start}" +
      ".mo-bubble{border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}" +
      ".mo-msg-user .mo-bubble{background:#2563eb;color:#fff;border-bottom-right-radius:4px}" +
      ".mo-msg-assistant .mo-bubble{background:#fff;color:#111827;border:1px solid #e5e7eb;border-bottom-left-radius:4px}" +
      ".mo-time{font-size:11px;color:#94a3b8;padding:0 4px}" +
      ".mo-msg-user .mo-time{text-align:right}" +
      "#mo-chat-form{border-top:1px solid #e5e7eb;background:#fff;padding:12px;display:flex;gap:8px;align-items:flex-end}" +
      "#mo-chat-input{flex:1;min-height:40px;max-height:112px;border:1px solid #d1d5db;border-radius:10px;padding:10px 11px;font:14px/1.35 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;resize:none;outline:none}" +
      "#mo-chat-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12)}" +
      "#mo-chat-send{height:40px;min-width:68px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-size:14px;font-weight:700;cursor:pointer;padding:0 14px}" +
      "#mo-chat-send:disabled{opacity:.55;cursor:not-allowed}" +
      "#mo-chat-error{display:none;padding:9px 12px;background:#fef2f2;color:#991b1b;border-top:1px solid #fecaca;font-size:12px}" +
      "#mo-chat-error.mo-visible{display:block}" +
      "@media(max-width:480px){#mo-chat-button{right:16px;bottom:16px}#mo-chat-panel{right:12px;bottom:82px;width:calc(100vw - 24px);height:min(560px,calc(100vh - 100px));border-radius:12px}}";
    document.head.appendChild(style);
  }

  function icon(name) {
    if (name === "close") {
      return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 6.75A3.75 3.75 0 0 1 8.25 3h7.5a3.75 3.75 0 0 1 3.75 3.75v5.5A3.75 3.75 0 0 1 15.75 16H11l-5.2 4.1A.8.8 0 0 1 4.5 19.47V6.75Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  }

  function buildWidget() {
    addStyles();

    var root = document.createElement("div");
    root.id = rootId;

    var button = document.createElement("button");
    button.id = "mo-chat-button";
    button.type = "button";
    button.setAttribute("aria-label", "Open Mirrorean One chat");
    button.innerHTML = icon("chat");

    var panel = document.createElement("section");
    panel.id = "mo-chat-panel";
    panel.setAttribute("aria-label", "Mirrorean One chat");
    panel.innerHTML =
      '<div id="mo-chat-header">' +
      '<div><div id="mo-chat-title">Mirrorean One</div><div id="mo-chat-status">Online</div></div>' +
      '<button id="mo-chat-close" type="button" aria-label="Close chat">' + icon("close") + "</button>" +
      "</div>" +
      '<div id="mo-chat-messages" aria-live="polite"></div>' +
      '<div id="mo-chat-error" role="status"></div>' +
      '<form id="mo-chat-form">' +
      '<textarea id="mo-chat-input" rows="1" placeholder="Type your message..." aria-label="Message"></textarea>' +
      '<button id="mo-chat-send" type="submit">Send</button>' +
      "</form>";

    root.appendChild(panel);
    root.appendChild(button);
    document.body.appendChild(root);

    var close = panel.querySelector("#mo-chat-close");
    var messages = panel.querySelector("#mo-chat-messages");
    var form = panel.querySelector("#mo-chat-form");
    var input = panel.querySelector("#mo-chat-input");
    var send = panel.querySelector("#mo-chat-send");
    var error = panel.querySelector("#mo-chat-error");

    function timeLabel() {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function showError(message) {
      error.textContent = message || "";
      error.classList.toggle("mo-visible", Boolean(message));
    }

    function addMessage(text, role) {
      var item = document.createElement("div");
      item.className = "mo-msg mo-msg-" + role;

      var bubble = document.createElement("div");
      bubble.className = "mo-bubble";
      bubble.textContent = text;

      var time = document.createElement("div");
      time.className = "mo-time";
      time.textContent = timeLabel();

      item.appendChild(bubble);
      item.appendChild(time);
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
    }

    function setOpen(nextOpen) {
      isOpen = nextOpen;
      panel.classList.toggle("mo-open", isOpen);
      button.setAttribute("aria-label", isOpen ? "Close Mirrorean One chat" : "Open Mirrorean One chat");
      if (isOpen) {
        setTimeout(function () {
          input.focus();
        }, 50);
      }
    }

    function setSending(nextSending) {
      isSending = nextSending;
      input.disabled = nextSending;
      send.disabled = nextSending;
      send.textContent = nextSending ? "Sending" : "Send";
    }

    function resizeInput() {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 112) + "px";
    }

    async function sendMessage() {
      var text = input.value.trim();
      if (!text || isSending) return;

      if (!agentId || !widgetKey) {
        showError("Chat is missing its website configuration.");
        return;
      }

      showError("");
      input.value = "";
      resizeInput();
      addMessage(text, "user");
      setSending(true);

      var payload = {
        agent_id: agentId,
        widget_key: widgetKey,
        message: text
      };

      if (conversationId) {
        payload.conversation_id = conversationId;
      }

      try {
        var response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        var data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok) {
          throw new Error(data.error || data.message || "Request failed");
        }

        if (data.conversation_id) {
          conversationId = data.conversation_id;
        }

        addMessage(data.reply || "I received your message.", "assistant");
      } catch (err) {
        showError("Unable to reach Mirrorean One. Please try again.");
      } finally {
        setSending(false);
        input.focus();
      }
    }

    button.addEventListener("click", function () {
      setOpen(!isOpen);
    });

    close.addEventListener("click", function () {
      setOpen(false);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendMessage();
    });

    input.addEventListener("input", resizeInput);

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
      }
    });

    addMessage("Hi, this website chat channel is connected to Mirrorean One.", "assistant");
  }

  onReady(buildWidget);
})();

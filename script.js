
        // Shared cart using localStorage
        let cart = JSON.parse(localStorage.getItem('pastelCart')) || [];

        function saveCart() {
            localStorage.setItem('pastelCart', JSON.stringify(cart));
            updateCartCount();
        }

        function updateCartCount() {
            const total = cart.reduce((s, i) => s + i.qty, 0);
            const el = document.getElementById('cart-count');
            if (el) {
                el.textContent = total;
                el.style.background = total > 0 ? '#90EE90' : '#FFD1DC';
            }
        }

        function addToCart(id, name, price, img) {
            const ex = cart.find(i => i.id === id);
            if (ex) {
                ex.qty++;
            } else {
                cart.push({ id, name, price, qty: 1, img: img || `https://picsum.photos/80/80?random=${id}` });
            }
            saveCart();
            showToast('✓ ' + name + ' added to cart!');
        }

        function showToast(msg, type = 'success') {
            const toastContainer = document.getElementById('toast-container');
            const t = document.createElement('div');
            t.textContent = msg;
            t.className = 'toast';
            if (type === 'error') {
                t.classList.add('error');
            }
            toastContainer.appendChild(t);
            setTimeout(() => {
                t.classList.add('show');
            }, 10); // Small delay to allow element to be added before transition
            setTimeout(() => {
                t.classList.remove('show');
                t.addEventListener('transitionend', () => t.remove());
            }, 2500);
        }

        document.addEventListener('DOMContentLoaded', () => {
            updateCartCount();

            // Mark active nav link
            const page = location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('nav a').forEach(a => {
                if (a.getAttribute('href') === page) {
                    a.classList.add('active');
                } else {
                    a.classList.remove('active');
                }
            });

            // Add to cart buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault(); e.stopPropagation();
                    const card = this.closest('.product-card');
                    const name = card?.querySelector('h3')?.textContent || 'Item';
                    const priceText = card?.querySelector('.price')?.textContent || '$9.99';
                    const price = parseFloat(priceText.replace('$',''));
                    const id = this.dataset.id || name.replace(/\s/g,'').toLowerCase();
                    const img = card?.querySelector('img')?.src;
                    addToCart(id, name, price, img);
                    // Temporary button feedback
                    const originalText = this.textContent;
                    const originalBg = this.style.background;
                    this.textContent = '✓ Added!';
                    this.style.background = '#8fbc8f';
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = originalBg;
                    }, 1800);
                });
            });

            // Chatbot Widget
            const chatBubble  = document.getElementById('chat-bubble');
            const chatBox     = document.getElementById('chatbot-box');
            const chatClose   = document.getElementById('chatbot-close');
            const chatSend    = document.getElementById('chatbot-send');
            const chatInput   = document.getElementById('chatbot-input');
            const chatMsgs    = document.getElementById('chatbot-messages');

            if (chatBubble) chatBubble.addEventListener('click', () => {
                chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
                if (chatBox.style.display === 'flex') {
                    chatInput.focus();
                }
            });
            if (chatClose)  chatClose.addEventListener('click',  () => chatBox.style.display = 'none');
            if (chatSend)   chatSend.addEventListener('click', sendChat);
            if (chatInput)  chatInput.addEventListener('keypress', e => { if(e.key === 'Enter') sendChat(); });

            function sendChat() {
                const msg = chatInput?.value.trim();
                if (!msg) return;
                addChatMsg('user', msg);
                chatInput.value = '';
                setTimeout(() => addChatMsg('bot', getBotReply(msg)), 700);
                chatMsgs.scrollTop = chatMsgs.scrollHeight; // Auto-scroll
            }

            function addChatMsg(who, text) {
                const d = document.createElement('div');
                d.textContent = text;
                d.style.cssText = `margin-bottom:10px;padding:10px 14px;border-radius:18px;max-width:80%;font-size:0.9rem;word-wrap:break-word;`;
                if (who === 'user') {
                    d.style.cssText += `background:var(--green);margin-left:auto;color:var(--text);border-bottom-right-radius:4px;`;
                } else {
                    d.style.cssText += `background:var(--purple);margin-right:auto;color:var(--text);border-bottom-left-radius:4px;`;
                }
                if (chatMsgs) {
                    chatMsgs.appendChild(d);
                    chatMsgs.scrollTop = chatMsgs.scrollHeight;
                }
            }

            function getBotReply(msg) {
                const m = msg.toLowerCase();
                if (m.includes('hi') || m.includes('hello') || m.includes('hey')) return 'Hello! 🌸 Welcome to Pastel Dreams! How can I help you today?';
                if (m.includes('product') || m.includes('shop') || m.includes('buy')) return 'We have beautiful mugs, pillows, notebooks and more! Visit our Products page to see everything! 🛍';
                if (m.includes('cart') || m.includes('bag')) return 'Click the 🛒 Cart link in the top navbar to view your cart!';
                if (m.includes('promo') || m.includes('discount') || m.includes('code')) return 'Use code DREAM10 at checkout for 10% off your order! 🎉';
                if (m.includes('ship') || m.includes('deliver')) return 'We offer FREE shipping on orders over $50! Standard shipping is just $5.99 💕';
                if (m.includes('login') || m.includes('account')) return 'Click the Login button in the navbar. Use OTP code 123456 for demo!';
                if (m.includes('return') || m.includes('refund')) return 'We have a hassle-free 30-day return policy. Contact us at support@pasteldreams.com!';
                return "Thanks for your message! 💕 Our team will get back to you soon. Is there anything else I can help with?";
            }
        });
    
/**
 * Rimba Routes - Interactive Features
 * Contains all the logic for the interactive elements across the website.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // -----------------------------------------------------------------
    // 1. Eco Tourism Score System (Destinations Page)
    // -----------------------------------------------------------------
    const scoreBars = document.querySelectorAll('.eco-score-bar');
    if (scoreBars.length > 0) {
        scoreBars.forEach(bar => {
            const score = parseFloat(bar.getAttribute('data-score'));
            // Create the visual elements
            bar.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px;">
                    <strong>Eco Rating</strong>
                    <span style="color: var(--color-accent); font-weight: bold;">${score}/10</span>
                </div>
                <div style="width: 100%; height: 6px; background-color: #eee; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${score * 10}%; height: 100%; background-color: var(--color-accent); transition: width 1.5s ease-out;"></div>
                </div>
            `;
        });
    }

    // -----------------------------------------------------------------
    // 2. Real-Time Footer Clock
    // -----------------------------------------------------------------
    const clockElement = document.getElementById('realtime-clock');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            // Format time for Kuala Lumpur (GMT+8 as base reference for Malaysia)
            const options = { 
                timeZone: 'Asia/Kuala_Lumpur', 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true
            };
            const timeString = now.toLocaleDateString('en-US', options);
            clockElement.innerHTML = `<i class="fa-regular fa-clock"></i> Malaysia Time: ${timeString}`;
        }
        updateClock(); // Initial call
        setInterval(updateClock, 1000); // Update every second
    }

    // Update current year in footer
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------------------
    // 3. Tour Carbon Footprint Calculator (About Page)
    // -----------------------------------------------------------------
    const carbonForm = document.getElementById('carbon-form');
    if (carbonForm) {
        carbonForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const distance = parseFloat(document.getElementById('distance').value);
            const transport = document.getElementById('transport').value;
            const days = parseInt(document.getElementById('days').value);
            
            // Basic CO2 emission factors (kg CO2 per km)
            const factors = {
                'private_car': 0.19,
                'public_bus': 0.08,
                'train': 0.04,
                'boat': 0.12,
                'flight': 0.25 // added implicitly if user considers flight distance
            };

            const transportEmissions = distance * (factors[transport] || 0.1);
            const hotelEmissions = days * 15; // Rough estimate of 15kg CO2 per night in eco-hotel

            const totalCo2 = Math.round(transportEmissions + hotelEmissions);
            
            document.getElementById('co2-output').textContent = totalCo2;
            
            let suggestion = "";
            if (totalCo2 < 100) {
                suggestion = "Excellent! Your footprint is extremely low. Perfect eco-traveler!";
            } else if (totalCo2 < 300) {
                suggestion = "Good job keeping it moderate. Consider taking trains instead of cars next time.";
            } else {
                suggestion = "Your footprint is slightly high. Look into offsetting your carbon via local reforestation projects.";
            }
            
            document.getElementById('co2-suggestion').textContent = suggestion;
            document.getElementById('calc-result').style.display = 'block';
        });
    }

    // -----------------------------------------------------------------
    // 4. Multi-Step Eco Travel Quiz (About Page)
    // -----------------------------------------------------------------
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const questions = [
            {
                text: "Question 1: What is your ideal afternoon on vacation?",
                options: [
                    { text: "A) Trekking up a dense mountain trail.", type: "Adventure Explorer" },
                    { text: "B) Sitting quietly waiting for a rare bird.", type: "Wildlife Photographer" },
                    { text: "C) Relaxing at a sustainable eco-lodge.", type: "Nature Lover" },
                    { text: "D) Scuba diving in a marine park.", type: "Ocean Advocate" }
                ]
            },
            {
                text: "Question 2: Choose your preferred accommodation:",
                options: [
                    { text: "A) A tent deep in the national park.", type: "Adventure Explorer" },
                    { text: "B) A rustic cabin near an animal sanctuary.", type: "Wildlife Photographer" },
                    { text: "C) A luxury zero-emission eco-resort.", type: "Nature Lover" },
                    { text: "D) A liveaboard dive boat.", type: "Ocean Advocate" }
                ]
            },
            {
                text: "Question 3: What's your travel pace?",
                options: [
                    { text: "A) Fast and action-packed! Let's conquer peaks.", type: "Adventure Explorer" },
                    { text: "B) Patient and observant. Waiting for the right moment.", type: "Wildlife Photographer" },
                    { text: "C) Relaxed and slow. I want to absorb the culture.", type: "Nature Lover" },
                    { text: "D) Tied to the tides and dive schedules.", type: "Ocean Advocate" }
                ]
            },
            {
                text: "Question 4: What is your primary mode of preferred transport?",
                options: [
                    { text: "A) Off-road 4x4 or hiking boots.", type: "Adventure Explorer" },
                    { text: "B) Silent river boats.", type: "Wildlife Photographer" },
                    { text: "C) Electric buggies and modern trains.", type: "Nature Lover" },
                    { text: "D) Kayaks and speedboats.", type: "Ocean Advocate" }
                ]
            },
            {
                text: "Question 5: Why do you travel?",
                options: [
                    { text: "A) To push my physical limits.", type: "Adventure Explorer" },
                    { text: "B) To document the unseen natural world.", type: "Wildlife Photographer" },
                    { text: "C) To reconnect, unplug, and support local economies.", type: "Nature Lover" },
                    { text: "D) To explore the 70% of the earth covered in water.", type: "Ocean Advocate" }
                ]
            }
        ];

        let currentQuestionIdx = 0;
        let scores = {
            "Adventure Explorer": 0,
            "Wildlife Photographer": 0,
            "Nature Lover": 0,
            "Ocean Advocate": 0
        };

        const questionTextEl = document.getElementById('quiz-question-text');
        const optionsContainer = document.getElementById('quiz-options-container');
        const progressEl = document.getElementById('quiz-progress');
        const resultBox = document.getElementById('quiz-result');
        const resultPersonality = document.getElementById('quiz-personality');
        const resultDescription = document.getElementById('quiz-description');

        // Make reset Quiz globally available so button can call it
        window.resetQuiz = function() {
            currentQuestionIdx = 0;
            scores = { "Adventure Explorer": 0, "Wildlife Photographer": 0, "Nature Lover": 0, "Ocean Advocate": 0 };
            resultBox.style.display = 'none';
            quizContainer.style.display = 'block';
            renderQuestion();
        };

        function renderQuestion() {
            const q = questions[currentQuestionIdx];
            questionTextEl.textContent = q.text;
            progressEl.textContent = `Question ${currentQuestionIdx + 1} of ${questions.length}`;
            
            optionsContainer.innerHTML = ''; // Clear old options
            
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = opt.text;
                btn.onclick = () => handleAnswer(opt.type);
                optionsContainer.appendChild(btn);
            });
        }

        function handleAnswer(type) {
            scores[type]++;
            currentQuestionIdx++;
            
            if (currentQuestionIdx < questions.length) {
                renderQuestion();
            } else {
                showQuizResult();
            }
        }

        function showQuizResult() {
            quizContainer.style.display = 'none';
            
            // Find highest score
            let maxScore = 0;
            let finalType = "Nature Lover"; // default
            for (const [type, score] of Object.entries(scores)) {
                if (score > maxScore) {
                    maxScore = score;
                    finalType = type;
                }
            }

            const descriptions = {
                "Adventure Explorer": "You crave adrenaline and the raw power of nature. Mt. Kinabalu or white water rafting is your perfect match.",
                "Wildlife Photographer": "Patience is your virtue. The deep jungles of Danum Valley or Bako National Park await your lens.",
                "Nature Lover": "You seek harmony and comfort intertwined with conservation. Cameron Highlands or a Langkawi eco-resort is for you.",
                "Ocean Advocate": "The ocean calls to you. Sipadan, Redang, and marine conservation efforts are where your heart lies."
            };

            resultPersonality.textContent = finalType;
            resultDescription.textContent = descriptions[finalType];
            resultBox.style.display = 'block';
        }

        // Initialize first question
        renderQuestion();
    }

    // -----------------------------------------------------------------
    // 5. Advanced AI Travel Planner (Contact Page)
    // -----------------------------------------------------------------
    const plannerForm = document.getElementById('planner-form');
    if (plannerForm) {
        plannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const days = parseInt(document.getElementById('plan-days').value);
            const region = document.getElementById('plan-region').value;
            const activity = document.getElementById('plan-activity').value;
            const pace = document.getElementById('plan-pace').value;
            
            const outputDiv = document.getElementById('planner-output');
            outputDiv.innerHTML = `<h3 style="margin-bottom: 15px; border-bottom: 2px solid var(--color-accent); padding-bottom: 5px;">Your ${days}-Day ${pace} Itinerary</h3>`;
            
            let itineraryHTML = '';

            // Generate intelligent-looking mock itinerary based on parameters
            if (region === 'Borneo (Sabah/Sarawak)') {
                if (activity === 'Wildlife Safari') {
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 1: Arrival in Sandakan</div><p>Settle into a local eco-lodge. Orientation on ethical wildlife observation.</p></div>`;
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 2: Kinabatangan River Cruise</div><p>Dawn boat ride to spot Pygmy Elephants and Proboscis monkeys.</p></div>`;
                    if (days >= 5) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 3: Sepilok Orangutan Centre</div><p>Visit the rehabilitation center, supporting their sanctuary operations.</p></div>`;
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 4: Danum Valley Transit</div><p>Travel deep into the primary rainforest. Night walk safari.</p></div>`;
                    }
                    if (days === 7) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 5: Canopy Walk & Research</div><p>Engage with local researchers in Danum Valley.</p></div>`;
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 6: Jungle Trekking</div><p>Guided deep forest trek tracking elusive mammals.</p></div>`;
                    }
                } else {
                    // Default Borneo
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 1: Arrival & Briefing</div><p>Arrive in Kuching or Kota Kinabalu. Check into sustainable lodging.</p></div>`;
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 2: National Park Exploration</div><p>Visit Bako or Kinabalu Park for guided ${activity}.</p></div>`;
                    if (days >= 5) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 3: Indigenous Culture</div><p>Visit a local longhouse to learn about sustainable heritage.</p></div>`;
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 4: Deep Ecology Tour</div><p>Immersive ${pace.toLowerCase()} tour focused on local flora and fauna.</p></div>`;
                    }
                    if (days === 7) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 5-6: Extended Excursion</div><p>Overnight camping or eco-resort stay deeper in the reserve.</p></div>`;
                    }
                }
            } else {
                // Peninsular Malaysia
                if (activity === 'Marine & Coastal') {
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 1: Transfer to East Coast</div><p>Arrive in Terengganu, ferry to Redang Island strictly regulated eco-resort.</p></div>`;
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 2: Marine Park Snorkeling</div><p>Guided, no-touch snorkeling ensuring zero damage to coral reefs.</p></div>`;
                    if (days >= 5) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 3: Turtle Conservation</div><p>Volunteer half-day at local sea turtle sanctuary.</p></div>`;
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 4: Island Jungle Trek</div><p>Hike the interior island trails.</p></div>`;
                    }
                     if (days === 7) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 5-6: Advanced Dives & Kayak</div><p>Scuba diving or silent mangrove kayaking around the coastline.</p></div>`;
                    }
                } else {
                    // Default Peninsular
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 1: Arrival & Transit</div><p>Transfer from KL to Taman Negara or Cameron Highlands.</p></div>`;
                    itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 2: ${activity}</div><p>${pace} guided tour via registered local eco-guides.</p></div>`;
                    if (days >= 5) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 3: Canopy Walk / Farm</div><p>Explore the physical layers of the ecosystem.</p></div>`;
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 4: Indigenous Knowledge</div><p>Learn sustainable foraging from the Orang Asli.</p></div>`;
                    }
                     if (days === 7) {
                        itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day 5-6: Deep Forest Trek</div><p>Overnight excursion to remote waterfalls or observation hides.</p></div>`;
                    }
                }
            }
            
            // Final Day always departure
            itineraryHTML += `<div class="itinerary-day"><div class="day-title">Day ${days}: Departure</div><p>Calculate your carbon footprint and depart via low-emission transport.</p></div>`;

            outputDiv.innerHTML += itineraryHTML;
            outputDiv.style.display = 'block';
            
            // Scroll to output
            outputDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

});

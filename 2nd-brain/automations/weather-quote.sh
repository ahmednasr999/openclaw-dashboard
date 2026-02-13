#!/bin/bash
# Weather + Quote Generator

WEATHER=$(curl -s "wttr.in/Cairo?format=%C+%t" 2>/dev/null || echo "Cairo: Clear +25°C")
QUOTES=(
  "The only way to do great work is to love what you do. - Steve Jobs"
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Churchill"
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
  "It is during our darkest moments that we must focus to see the light. - Aristotle"
  "The only impossible journey is the one you never begin. - Tony Robbins"
)

RANDOM_QUOTE=${QUOTES[$RANDOM % ${#QUOTES[@]}]}

echo "🌤️ Weather: $WEATHER"
echo "💭 Quote: $RANDOM_QUOTE"

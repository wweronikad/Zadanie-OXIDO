const fs = require('fs');
const { OpenAI } = require('openai');

// Pobierz klucz API z zmiennej środowiskowej
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('Proszę ustawić klucz API OpenAI w zmiennej środowiskowej OPENAI_API_KEY.');
  process.exit(1);
}

// Utwórz instancję OpenAI
const openai = new OpenAI({
  apiKey: apiKey, // przekazanie klucza API
});

// Główna logika programu
fs.readFile('artykuł.txt', 'utf8', async (err, data) => {
  if (err) {
    console.error('Błąd podczas odczytu pliku artykułu:', err);
    return;
  }

  const articleText = data;

  // Przygotuj prompt
  const prompt = `Przetwórz poniższy artykuł i wygeneruj kod HTML zgodnie z następującymi wytycznymi:
• Użyj odpowiednich tagów HTML do strukturyzacji treści.
• Określ miejsca, gdzie warto wstawić grafiki – oznacz je z użyciem tagu <img> z atrybutem src="image_placeholder.jpg". Dodaj atrybut alt do każdego obrazka z dokładnym promptem, który możemy użyć do wygenerowania grafiki. Umieść podpisy pod grafikami używając odpowiedniego tagu HTML.
• Brak kodu CSS ani JavaScript. Zwrócony kod powinien zawierać wyłącznie zawartość do wstawienia pomiędzy tagami <body> i </body>. Nie dołączaj znaczników <html>, <head> ani <body>.

Artykuł:
${articleText}
`;

  try {
    // Wywołaj API OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Zmieniono model na lepszy
      messages: [{ role: 'user', content: prompt }],
    });

    const htmlContent = completion.choices[0].message.content;

    // Zapisz wygenerowany kod HTML do pliku 'artykul.html'
    fs.writeFile('artykul.html', htmlContent, (err) => {
      if (err) {
        console.error('Błąd podczas zapisywania pliku HTML:', err);
        return;
      }
      console.log('Kod HTML został zapisany w pliku artykul.html');
    });
  } catch (error) {
    console.error('Błąd podczas wywoływania API OpenAI:', error);
  }
});

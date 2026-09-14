export const exercises = {
  1: [
    {
      id: 1,
      title: "Din första variabel",
      description:
        "Skapa en variabel som heter age och ge den värdet 25.",
      instruction:
        "Dra kodblocken till rätt ordning så att variabeln skapas korrekt.",

      blocks: [
        {
          id: "age-variable",
          text: "age",
        },
        {
          id: "age-equals",
          text: "=",
        },
        {
          id: "age-value",
          text: "25",
        },
      ],

      correctOrder: [
        "age-variable",
        "age-equals",
        "age-value",
      ],
    },

    {
      id: 2,
      title: "Arbeta med text",
      description:
        'Skapa en variabel som heter name och ge den texten "Elin".',
      instruction:
        "Placera blocken i rätt ordning så att texten sparas i variabeln.",

      blocks: [
        {
          id: "name-variable",
          text: "name",
        },
        {
          id: "name-equals",
          text: "=",
        },
        {
          id: "name-value",
          text: '"Elin"',
        },
      ],

      correctOrder: [
        "name-variable",
        "name-equals",
        "name-value",
      ],
    },

    {
      id: 3,
      title: "Enkel beräkning",
      description:
        "Skapa en variabel som heter result och spara resultatet av 5 + 3.",
      instruction:
        "Bygg beräkningen genom att placera blocken i rätt ordning.",

      blocks: [
        {
          id: "result-variable",
          text: "result",
        },
        {
          id: "result-equals",
          text: "=",
        },
        {
          id: "number-five",
          text: "5",
        },
        {
          id: "plus",
          text: "+",
        },
        {
          id: "number-three",
          text: "3",
        },
      ],

      correctOrder: [
        "result-variable",
        "result-equals",
        "number-five",
        "plus",
        "number-three",
      ],
    },

    {
      id: 4,
      title: "Villkor",
      description:
        "Skapa ett villkor som kontrollerar om age är större än 18.",
      instruction:
        "Sätt ihop if-satsen i rätt ordning.",

      blocks: [
        {
          id: "if-open",
          text: "if (",
        },
        {
          id: "if-age",
          text: "age",
        },
        {
          id: "greater-than",
          text: ">",
        },
        {
          id: "eighteen",
          text: "18",
        },
        {
          id: "if-close",
          text: ")",
        },
      ],

      correctOrder: [
        "if-open",
        "if-age",
        "greater-than",
        "eighteen",
        "if-close",
      ],
    },

    {
      id: 5,
      title: "Kombinera det du lärt dig",
      description:
        "Skapa en variabel för ålder och använd den sedan i ett villkor.",
      instruction:
        "Bygg koden i rätt ordning genom att kombinera variabel och villkor.",

      blocks: [
        {
          id: "combined-age",
          text: "age",
        },
        {
          id: "combined-equals",
          text: "=",
        },
        {
          id: "combined-value",
          text: "25",
        },
        {
          id: "combined-if-open",
          text: "if (",
        },
        {
          id: "combined-if-age",
          text: "age",
        },
        {
          id: "combined-greater-than",
          text: ">",
        },
        {
          id: "combined-eighteen",
          text: "18",
        },
        {
          id: "combined-if-close",
          text: ")",
        },
      ],

      correctOrder: [
        "combined-age",
        "combined-equals",
        "combined-value",
        "combined-if-open",
        "combined-if-age",
        "combined-greater-than",
        "combined-eighteen",
        "combined-if-close",
      ],
    },
  ],
};

export function getExercise(level, exerciseId) {
  const levelExercises = exercises[Number(level)];

  if (!levelExercises) {
    return null;
  }

  return (
    levelExercises.find(
      (exercise) =>
        exercise.id === Number(exerciseId)
    ) ?? null
  );
}

export function getExercisesForLevel(level) {
  return exercises[Number(level)] ?? [];
}
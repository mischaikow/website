import random
import json
from collections import deque
from enum import Enum

VALUE_MAPPING = {
    "A": 14,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
}


class Suit(Enum):
    spade = "♠"
    heart = "♥"
    diamond = "♦"
    club = "♣"


class Card:
    def __init__(self, suit, value_string):
        self.suit = suit
        self.value_string = value_string

    def __repr__(self) -> str:
        return self.value_string + "-" + self.suit.value

    def return_score(self) -> int:
        return VALUE_MAPPING[self.value_string]


class Deck:
    def __init__(self):
        self.cards = self.generate_cards()

    def generate_cards(self):
        cards = []
        for suit in Suit:
            for i in range(2, 11):
                cards.append(Card(suit, str(i)))

        for i in ["A", "J", "Q", "K"]:
            cards.append(Card(Suit.spade, i))
            cards.append(Card(Suit.club, i))

        random.shuffle(cards)
        return deque(cards)

    def deck_size(self) -> int:
        return len(self.cards)

    def draw_card(self) -> Card:
        if len(self.cards) == 0:
            return None
        return self.cards.popleft()

    def bottom_card(self, card: Card) -> None:
        self.cards.append(card)

    def bottom_card_list_random(self, cards) -> None:
        random.shuffle(cards)
        for a_card in cards:
            self.bottom_card(a_card)


class Game:

    def __init__(self):
        self.deck = Deck()
        self.cards_played = {
            Suit.club: [],
            Suit.diamond: [],
            Suit.heart: [],
            Suit.spade: [],
        }

        self.board = []

        self.weapon: int = 0
        self.weapon_defeat_stack = []

        self.room = 0
        self.health = 20

        self.skipped_last_room = False

        self.is_victory = False
        self.is_defeat = False

        self.next_room()

    # Drawing cards
    def draw_card(self):
        top_card = self.deck.draw_card()
        if top_card is None:
            print("You escaped!")
            self.is_victory = True

        self.board.append(top_card)

    def next_room(self):
        if len(self.board) > 1:
            self.deck.bottom_card_list_random(self.board)
            self.board = []
            self.skipped_last_room = True
        else:
            self.skipped_last_room = False

        while len(self.board) < 4:
            self.draw_card()

        self.room += 1

    # Playing the game
    def play(self, user_input: str) -> None:
        if user_input.isdigit():
            self.card_play(int(user_input))
        elif user_input == "S":
            self.next_room()
        else:
            ## TODO ~ Insert error.
            pass
        
        # Did you die?
        if self.health <= 0:
            self.is_defeat = True

    def card_play(self, card_index: int) -> None:
        played_card = self.board.pop(card_index)
        self.cards_played[played_card.suit].append(played_card.return_score())
        self.cards_played[played_card.suit].sort()

        if played_card.suit == Suit.diamond:
            self.diamond_play(played_card)
        elif played_card.suit == Suit.heart:
            self.heart_play(played_card)
        else:
            self.black_play(played_card)

        if len(self.board) == 1:
            self.next_room()

    def diamond_play(self, card: Card) -> None:
        self.weapon = card.return_score()
        self.weapon_defeat_stack = []

    def heart_play(self, card: Card) -> None:
        self.health = min(20, self.health + card.return_score())

    def black_play(self, card: Card) -> None:
        if self.weapon == 0:
            self.health -= card.return_score()
        elif (
            len(self.weapon_defeat_stack) == 0
            or self.weapon_defeat_stack[-1].return_score() > card.return_score()
        ):
            self.health -= max(0, card.return_score() - self.weapon)
            self.weapon_defeat_stack.append(card)
        else:
            self.health -= card.return_score()



##  Scoundrel interface
# Printing
def print_board(game: Game) -> list[str]:
    return [str(x) for x in game.board]


def print_defeat_stack(game: Game) -> str:
    return "  ".join([str(x) for x in game.weapon_defeat_stack])


def format_cards_played(game: Game) -> dict:
    result = {}
    for s in Suit:
        if len(game.cards_played[s]) > 0:
            result[s.value] = []

            for val in game.cards_played[s]:
                if val == 14:
                    result[s.value].append("A")
                elif val == 11:
                    result[s.value].append("J")
                elif val == 12:
                    result[s.value].append("Q")
                elif val == 13:
                    result[s.value].append("K")
                else:
                    result[s.value].append(str(val))
    return result


def format_defeat_stack(defeat_stack: list[Card]) -> list[str]:
    return [x.value_string for x in defeat_stack]


def generate_game_state(game: Game) -> str:
    return json.dumps(
        {
            "room": game.room,
            "board": print_board(game),
            "weapon": game.weapon,
            "weapon_chain": format_defeat_stack(game.weapon_defeat_stack),
            "health": game.health,
            "cards_played": format_cards_played(game),
            "skipped_last_room": game.skipped_last_room,
            "is_victory": game.is_victory,
            "is_defeat": game.is_defeat,
        }
    )


# Input management
def read_js_input(a_str: str) -> None:
    if a_str.isdigit():
        a_str = str(int(a_str) - 1)

    if a_str == 'reset':
        global game
        game = Game()
    else:
        game.play(a_str)

    global game_state
    game_state = generate_game_state(game)


game = Game()
game_state = generate_game_state(game)

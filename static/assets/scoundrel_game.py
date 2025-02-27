import random
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

        self.weapon: int = None
        self.weapon_defeat_stack = []

        self.room = 0
        self.health = 20

        self.skipped_last_room = False

        self.game_ended = False

        self.next_room()

    # Drawing cards
    def draw_card(self):
        top_card = self.deck.draw_card()
        if top_card is None:
            print("You escaped!")
            self.game_ends()

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
        elif user_input == "skip":
            self.next_room()
        elif user_input == "game over":
            self.game_ends()
        else:
            print("PANIC")

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
        if self.weapon is None:
            self.health -= card.return_score()
        elif (
            len(self.weapon_defeat_stack) == 0
            or self.weapon_defeat_stack[-1].return_score() > card.return_score()
        ):
            self.health -= max(0, card.return_score() - self.weapon)
            self.weapon_defeat_stack.append(card)
        else:
            self.health -= card.return_score()

    # Information displays

    # Game status
    def is_game_over(self) -> bool:
        if self.game_ended:
            return True

        if self.deck.deck_size() == 0:
            self.game_ends()
            print("you escaped!")
            return True

        if self.health <= 0:
            self.game_ends()
            print("you died.")
            return True

        return False

    def game_ends(self):
        self.game_ended = True


##  Scoundrel interface
# Printing
def print_board(game: Game) -> str:
    board_display = ""
    for i in range(len(game.board)):
        board_display += str(i + 1)
        board_display += "["
        board_display += str(game.board[i])
        board_display += "]  "
    return board_display


def print_defeat_stack(game: Game) -> str:
    return "  ".join([str(x) for x in game.weapon_defeat_stack])


def print_game_weapon(game: Game) -> str:
    if game.weapon is None:
        return "Unarmed"

    defeat_stack_string = ""
    if len(game.weapon_defeat_stack) > 0:
        defeat_stack_string = ":"
        defeat_stack_string += " ".join(
            x.value_string for x in game.weapon_defeat_stack
        )

    return str(game.weapon) + defeat_stack_string


def print_health(game: Game) -> str:
    return str(game.health)


def print_cards_played(game: Game) -> list[str]:
    result = []
    for s in Suit:
        if len(game.cards_played[s]) > 0:
            suit_print = s.value

            output = []
            for val in game.cards_played[s]:
                if val == 14:
                    output.append("A")
                elif val == 11:
                    output.append("J")
                elif val == 12:
                    output.append("Q")
                elif val == 13:
                    output.append("K")
                else:
                    output.append(str(val))
            result.append(f"{suit_print}: {', '.join(output)}")
    return result


def print_skip_room_option(game: Game) -> str:
    if game.skipped_last_room:
        return "You cannot skip this room"
    return "Type 'S' to skip room"


def print_card_choices(game: Game) -> str:
    return f"pick card 1-{len(game.board)}"


def generate_html_string(strings: list[str]) -> str:
    result = ""
    for a_str in strings:
        result += "<p>"
        result += a_str
        result += "</p>"
    return result


def print_game_state(game: Game) -> str:
    return generate_html_string(
        [
            f"    Room {game.room}",
            f"",
            f" Contains:",
            f"    {print_board(game)}",
            f"",
            f" Weapon:",
            f"    {print_game_weapon(game)}",
            f"",
            f"Health:  {print_health(game)} / 20",
            f"",
        ]
        + print_cards_played(game)
        + [
            f"",
            f"{print_skip_room_option(game)}, {print_card_choices(game)}, or 'Q' to quit:",
        ]
    )


# Input management
def read_input(game: Game) -> str:
    while True:

        next_action = input()

        if (
            next_action.isdigit()
            and 0 < int(next_action)
            and int(next_action) <= len(game.board)
        ):
            return str(int(next_action) - 1)
        elif next_action == "s" or next_action == "S":
            if game.skipped_last_room:
                print("Not allowed to skip")
            else:
                return "skip"
        elif next_action == "q" or next_action == "Q":
            return "game over"


game = Game()
game_state = print_game_state(game)


def dummy_loop(user_input):
    while not game.is_game_over():
        print()
        print_game_state(game)
        user_input = read_input(game)
        game.play(user_input)

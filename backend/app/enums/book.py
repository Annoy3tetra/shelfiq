from enum import Enum


class BookGenre(str, Enum):
    FICTION = "Fiction"
    NON_FICTION = "Non-Fiction"
    SCIENCE = "Science"
    TECHNOLOGY = "Technology"
    HISTORY = "History"
    BIOGRAPHY = "Biography"
    SELF_HELP = "Self-Help"
    BUSINESS = "Business"
    EDUCATION = "Education"
    CHILDREN = "Children"
    FANTASY = "Fantasy"
    ROMANCE = "Romance"
    MYSTERY = "Mystery"
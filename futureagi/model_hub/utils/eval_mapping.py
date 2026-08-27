"""Single definition of what a saved eval mapping value may be.

A mapping value is an attribute path string. Every resolver splits it on ".",
so any other type reaches a walker as an unhandled TypeError.
"""


def is_mapping_path(value) -> bool:
    return isinstance(value, str) and value != ""


def non_path_mapping_keys(mapping) -> list[str]:
    return sorted(
        key
        for key, path in (mapping or {}).items()
        if path is not None and not isinstance(path, str)
    )


def require_mapping_paths(mapping, target: str) -> None:
    """Raise ValueError for any mapping value that is not an attribute path."""
    for key, attribute in (mapping or {}).items():
        if attribute is not None and not isinstance(attribute, str):
            raise ValueError(
                f"Mapping value for key '{key}' must be an attribute path string, "
                f"got {type(attribute).__name__}, on {target}"
            )

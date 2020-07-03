

using UnityEditor;
using UnityEngine;

public class EditorExample
{
    static EditorExample()
    {
        EditorApplication.update += () => { Debug.Log("Hello World Form Unity Package!"); };
    }
}

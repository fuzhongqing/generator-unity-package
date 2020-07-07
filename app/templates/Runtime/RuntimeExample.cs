using UnityEngine;

public class RuntimeExample: MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("Hello World! From <%=projectName%>");
    }
}
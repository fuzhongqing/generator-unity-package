//https://docs.unity3d.com/2017.4/Documentation/Manual/testing-editortestsrunner.html


using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EditorExampleTest 
{
    [UnityTest]
    public IEnumerator EditorUtility_WhenExecuted_ReturnsSuccess()
    {
        var utility = RunEditorUtilityInTheBackgroud();

        while (utility.isRunning)
        {
            yield return null;
        }

        Assert.IsTrue(utility.isSuccess);
    }
}

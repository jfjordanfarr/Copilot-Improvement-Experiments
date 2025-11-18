using System;

namespace LiveDocs.Reflection
{
    public static class ReflectionFactory
    {
        public static object? CreateHandler(string typeName)
        {
            var resolvedType = Type.GetType(typeName);
            if (resolvedType == null)
            {
                return null;
            }

            return Activator.CreateInstance(resolvedType);
        }

        public static object? CreateTelemetryHandler()
        {
            return CreateHandler("LiveDocs.Reflection.TelemetryHandler");
        }
    }
}
